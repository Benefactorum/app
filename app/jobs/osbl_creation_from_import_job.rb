class OsblCreationFromImportJob < ApplicationJob
  queue_as :default

  class InvalidOsblImportData < StandardError; end

  def perform(osbl_import_id)
    osbl_import = OsblImport.find(osbl_import_id)
    osbl_data = parse(osbl_import.extracted_data)
    osbl = Osbl.new(osbl_data)

    if osbl.valid?
      create_contribution(osbl_import, osbl_data)
    else
      osbl_import.update!(status: "failed")
      raise InvalidOsblImportData, osbl.errors.full_messages.join(", ")
    end
  end

  private

  def parse(extracted_data)
    extracted_data.merge!(
      {
        "logo" => map_logo(extracted_data["logo"]),
        "osbls_causes_attributes" => MapAssociationsService.call(extracted_data["osbls_causes_attributes"], Osbl::Cause, create_missing: false),
        "osbls_keywords_attributes" => MapAssociationsService.call(extracted_data["osbls_keywords_attributes"], Osbl::Keyword),
        "osbls_intervention_areas_attributes" => MapAssociationsService.call(extracted_data["osbls_intervention_areas_attributes"], Osbl::InterventionArea),
        "osbls_labels_attributes" => MapAssociationsService.call(extracted_data["osbls_labels_attributes"], Osbl::Label, create_missing: false),
        "annual_finances_attributes" => MapAnnualFinancesService.call(extracted_data["annual_finances_attributes"]),
        "document_attachments_attributes" => map_document_attachments(extracted_data["document_attachments_attributes"]),
        "locations_attributes" => MapLocationsService.call(extracted_data["locations_attributes"])
      }
    ).compact
  end

  def create_contribution(osbl_import, osbl_data)
    contribution = osbl_import.user.contributions.build
    contribution.contributable = Contribution::OsblCreation.new(osbl_data:)

    ActiveRecord::Base.transaction do
      contribution.save!
      osbl_import.update!(status: "completed", contribution: contribution)
    end
  end

  def map_logo(logo_url)
    return nil if logo_url.nil?

    FileProcessor.download_from_url(logo_url, formats: %w[image/png image/svg+xml image/webp])
  end

  def map_document_attachments(document_attachments)
    return nil if document_attachments.blank?

    document_attachments.map do |document_attachment|
      file = FileProcessor.download_from_url(document_attachment["file"], formats: %w[application/pdf])
      next unless document_attachment["type"].present? && file.present?

      {
        "document_attributes" => {
          "type" => document_attachment["type"],
          "file" => file,
          "name" => document_attachment["name"],
          "year" => document_attachment["year"],
          "description" => document_attachment["description"]
        }
      }
    end.compact
  end
end
