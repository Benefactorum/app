class OsblCreationFromImportJob < ApplicationJob
  queue_as :default

  class InvalidOsblImportData < StandardError; end

  def perform(osbl_import_id)
    osbl_import = OsblImport.find(osbl_import_id)

    osbl_params = parse(osbl_import.extracted_data)

    osbl = Osbl.new(osbl_params)

    if osbl.valid?
      osbl_data = Contributions::OsblData::Serializer.new(osbl_params).call
      contribution = osbl_import.user.contributions.build
      contribution.contributable = Contribution::OsblCreation.new(osbl_data: osbl_data)

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
    osbl_params = extracted_data.except(
      "logo",
      "osbls_causes_attributes",
      "osbls_keywords_attributes",
      "osbls_intervention_areas_attributes",
      "osbls_labels_attributes",
      # "annual_finances_attributes",
      "document_attachments_attributes",
      "locations_attributes"
    )

    osbl_params["logo"] = FileProcessor.download_from_url(extracted_data["logo"])

    osbl_params["osbls_causes_attributes"] = extracted_data["osbls_causes_attributes"].map do |cause|
      {
        "cause_id" => Osbl::Cause.find_by!(name: cause["name"]).id
      }
    end

    osbl_params["osbls_keywords_attributes"] = extracted_data["osbls_keywords_attributes"]&.map do |keyword|
      {
        "keyword_id" => Osbl::Keyword.find_or_create_by!(name: keyword["name"]).id
      }
    end

    osbl_params["osbls_intervention_areas_attributes"] = extracted_data["osbls_intervention_areas_attributes"]&.map do |intervention_area|
      {
        "intervention_area_id" => Osbl::InterventionArea.find_or_create_by!(name: intervention_area["name"]).id
      }
    end

    osbl_params["osbls_labels_attributes"] = extracted_data["osbls_labels_attributes"]&.map do |label|
      next unless (label = Osbl::Label.find_by(name: label["name"]))

      {"label_id" => label.id}
    end&.compact

    osbl_params["document_attachments_attributes"] = extracted_data["document_attachments_attributes"]&.map do |document_attachment|
      {
        "document_attributes" => {
          "type" => document_attachment["type"],
          "file" => FileProcessor.download_from_url(document_attachment["file"]),
          "name" => document_attachment["name"],
          "year" => document_attachment["year"],
          "description" => document_attachment["description"]
        }
      }
    end

    osbl_params["locations_attributes"] = extracted_data["locations_attributes"]&.map do |location|
      confirmed_address = get_confirmed_address(location)

      next unless confirmed_address

      {
        "type" => location["type"],
        "address_attributes" => {
          "street_number" => confirmed_address["properties"]["housenumber"],
          "street_name" => confirmed_address["properties"]["street"],
          # "additional_info" => confirmed_address["properties"]["additional_info"],
          "postal_code" => confirmed_address["properties"]["postcode"],
          "city" => confirmed_address["properties"]["city"],
          "latitude" => confirmed_address["geometry"]["coordinates"][1],
          "longitude" => confirmed_address["geometry"]["coordinates"][0]
        }
      }
    end&.compact

    osbl_params.compact
  end

  def get_confirmed_address(location)
    full_address = "#{location["street_number"]} #{location["street_name"]} #{location["additional_info"]} #{location["postal_code"]} #{location["city"]}"
    return if full_address.blank?

    results = FrenchAddressApi.search(full_address)

    if results["features"].first["properties"]["score"] > 0.9
      results["features"].first
    end
  end
end
