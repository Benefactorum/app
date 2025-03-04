class OsblCreationFromImportJob < ApplicationJob
  queue_as :default

  class InvalidOsblImportData < StandardError; end

  def perform(osbl_import_id)
    osbl_import = OsblImport.find(osbl_import_id)

    osbl_data = parse(osbl_import.extracted_data)

    osbl = Osbl.new(osbl_data)

    if osbl.valid?
      contribution = osbl_import.user.contributions.build
      contribution.contributable = Contribution::OsblCreation.new(osbl_data:)

      ActiveRecord::Base.transaction do
        contribution.save!
        osbl_import.update!(status: "completed", contribution: contribution)
      end
    else
      raise InvalidOsblImportData, osbl.errors.full_messages.join(", ")
    end
  end

  private

  def parse(extracted_data)
    @processed_addresses = Set.new

    osbl_params = extracted_data.except(
      "logo",
      "osbls_causes_attributes",
      "osbls_keywords_attributes",
      "osbls_intervention_areas_attributes",
      "osbls_labels_attributes",
      "annual_finances_attributes",
      "document_attachments_attributes",
      "locations_attributes"
    )

    osbl_params["logo"] = FileProcessor.download_from_url(extracted_data["logo"], formats: %w[image/png image/svg+xml image/webp])

    osbl_params["osbls_causes_attributes"] = extracted_data["osbls_causes_attributes"].map do |cause|
      if (cause_record = Osbl::Cause.find_by(name: cause["name"]))
        {
          "cause_id" => cause_record.id.to_s,
          "name" => cause_record.name
        }
      else
        Rails.logger.error("Cause not found: #{cause["name"]}")
        nil
      end
    end.compact

    osbl_params["osbls_keywords_attributes"] = extracted_data["osbls_keywords_attributes"]&.map do |keyword|
      {
        "keyword_id" => Osbl::Keyword.find_or_create_by!(name: keyword["name"]).id,
        "name" => keyword["name"]
      }
    end&.uniq { it["keyword_id"] }

    osbl_params["osbls_intervention_areas_attributes"] = extracted_data["osbls_intervention_areas_attributes"]&.map do |intervention_area|
      {
        "intervention_area_id" => Osbl::InterventionArea.find_or_create_by!(name: intervention_area["name"]).id,
        "name" => intervention_area["name"]
      }
    end&.uniq { it["intervention_area_id"] }

    osbl_params["osbls_labels_attributes"] = extracted_data["osbls_labels_attributes"]&.map do |label|
      if (label_record = Osbl::Label.find_by(name: label["name"].capitalize))
        {
          "label_id" => label_record.id.to_s,
          "name" => label_record.name
        }
      else
        Rails.logger.error("Label not found: #{label["name"]}")
        nil
      end
    end&.compact

    osbl_params["annual_finances_attributes"] = process_annual_finances(extracted_data["annual_finances_attributes"])

    osbl_params["document_attachments_attributes"] = extracted_data["document_attachments_attributes"]&.map do |document_attachment|
      next unless document_attachment["type"].present? && document_attachment["file"].present?

      {
        "document_attributes" => {
          "type" => document_attachment["type"],
          "file" => FileProcessor.download_from_url(document_attachment["file"], formats: %w[application/pdf]),
          "name" => document_attachment["name"],
          "year" => document_attachment["year"],
          "description" => document_attachment["description"]
        }
      }
    end&.compact

    osbl_params["locations_attributes"] = extracted_data["locations_attributes"]&.map do |location|
      confirmed_address = get_confirmed_address(location)

      next unless confirmed_address
      next if confirmed_address["properties"]["street"].blank?
      next if confirmed_address["properties"]["postcode"].blank?
      next if confirmed_address["properties"]["city"].blank?

      address_attributes = {
        "street_number" => confirmed_address["properties"]["housenumber"],
        "street_name" => confirmed_address["properties"]["street"],
        "postal_code" => confirmed_address["properties"]["postcode"],
        "city" => confirmed_address["properties"]["city"],
        "latitude" => confirmed_address["geometry"]["coordinates"][1],
        "longitude" => confirmed_address["geometry"]["coordinates"][0]
      }

      full_address = [
        address_attributes["street_number"],
        address_attributes["street_name"],
        address_attributes["postal_code"],
        address_attributes["city"]
      ].compact.join(" ").downcase

      next if @processed_addresses.include?(full_address)
      @processed_addresses.add(full_address)

      {
        "type" => location["type"],
        "address_attributes" => address_attributes
      }
    end&.compact

    osbl_params.compact
  end

  def process_annual_finances(annual_finances)
    return [] if annual_finances.blank?

    # Group by year and take the first entry for each year
    grouped_by_year = annual_finances.group_by { |af| af["year"] }
    unique_years = grouped_by_year.transform_values(&:first)

    unique_years.map do |year, annual_finance|
      computed_annual_finance = {
        "year" => year,
        "budget" => annual_finance["budget"],
        "treasury" => annual_finance["treasury"],
        "certified" => annual_finance["certified"],
        "employees_count" => annual_finance["employees_count"],
        "fund_sources_attributes" => process_fund_sources(annual_finance["fund_sources_attributes"]),
        "fund_allocations_attributes" => process_fund_allocations(annual_finance["fund_allocations_attributes"])
      }.compact

      next unless computed_annual_finance.except("year").any?

      computed_annual_finance
    end.compact
  end

  def process_fund_sources(sources)
    return nil if sources.blank?

    # Group by type and take the first entry for each type
    grouped_by_type = sources.group_by { |s| s["type"] }
    unique_types = grouped_by_type.transform_values(&:first)

    # Calculate total percentage
    total_percent = unique_types.values.sum { |s| s["percent"].to_d }

    # Only include if total is 100%
    return nil unless total_percent == 100

    unique_types.values.map do |source|
      {
        "type" => source["type"],
        "amount" => source["amount"],
        "percent" => source["percent"]
      }
    end
  end

  def process_fund_allocations(allocations)
    return nil if allocations.blank?

    # Group by type and take the first entry for each type
    grouped_by_type = allocations.group_by { |a| a["type"] }
    unique_types = grouped_by_type.transform_values(&:first)

    # Calculate total percentage
    total_percent = unique_types.values.sum { |a| a["percent"].to_d }

    # Only include if total is 100%
    return nil unless total_percent == 100

    unique_types.values.map do |allocation|
      {
        "type" => allocation["type"],
        "amount" => allocation["amount"],
        "percent" => allocation["percent"]
      }
    end
  end

  def get_confirmed_address(location, retries = 0)
    full_address = "#{location["address_attributes"]["street_number"]} #{location["address_attributes"]["street_name"]} #{location["address_attributes"]["additional_info"]} #{location["address_attributes"]["postal_code"]} #{location["address_attributes"]["city"]}"
    return if full_address.blank?

    results = FrenchAddressApi.search(full_address)

    if results["features"].any? && results["features"].first["properties"]["score"] > 0.8
      results["features"].first
    end
  rescue FrenchAddressApi::ApiError
    retries += 1
    sleep retries
    if retries < 3
      get_confirmed_address(location, retries)
    else
      Rails.logger.error("Failed to get confirmed address for #{full_address} after retries")
      nil
    end
  rescue => e
    Rails.logger.error(e.message)
    nil
  end
end
