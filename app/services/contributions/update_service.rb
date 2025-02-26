module Contributions
  class UpdateService
    def initialize(contribution:, params:)
      @contribution = contribution
      @params = params
    end

    def call
      osbl_params = @params.delete(:osbl)
      osbl_data = OsblData::Serializer.new(osbl_params).call
      osbl = Osbl.new(osbl_data)

      return [:error, osbl.errors] unless osbl.valid?

      remove_legacy_storage_files(osbl_data)

      @contribution.update!(
        processed_params.merge(
          contributable_attributes: {
            id: @contribution.contributable.id,
            osbl_data: osbl_data
          }
        )
      )

      [:ok, @contribution]
    end

    private

    def remove_legacy_storage_files(osbl_data)
      old_osbl_data = @contribution.osbl_data

      if old_osbl_data["logo"].present? && old_osbl_data["logo"] != osbl_data["logo"]
        ActiveStorage::Blob.find_signed(old_osbl_data["logo"]).purge_later
      end

      # Purge documents that are no longer present in the updated osbl_data
      if old_osbl_data["document_attachments_attributes"].present?
        old_document_files = extract_document_files(old_osbl_data)
        new_document_files = extract_document_files(osbl_data)

        # Find documents that are in old_osbl_data but not in new osbl_data
        old_document_files.each do |file_signed_id|
          unless new_document_files.include?(file_signed_id)
            begin
              ActiveStorage::Blob.find_signed(file_signed_id)&.purge_later
            rescue ActiveSupport::MessageVerifier::InvalidSignature
              # Skip if the signed ID is invalid
              Rails.logger.warn("Invalid signed ID found in osbl_data: #{file_signed_id}")
            end
          end
        end
      end
    end

    def extract_document_files(osbl_data)
      return [] if osbl_data["document_attachments_attributes"].blank?

      document_files = []

      case osbl_data["document_attachments_attributes"]
      when Array
        osbl_data["document_attachments_attributes"].each do |attachment|
          if attachment["document_attributes"] && attachment["document_attributes"]["file"].present?
            document_files << attachment["document_attributes"]["file"] if attachment["document_attributes"]["file"].is_a?(String)
          end
        end
      when Hash
        osbl_data["document_attachments_attributes"].each do |_, attachment|
          if attachment["document_attributes"] && attachment["document_attributes"]["file"].present?
            document_files << attachment["document_attributes"]["file"] if attachment["document_attributes"]["file"].is_a?(String)
          end
        end
      end

      document_files
    end

    def processed_params
      @params.tap do |params|
        params[:files]&.each_with_index do |file, index|
          next if file.is_a?(ActionDispatch::Http::UploadedFile)

          params[:files][index] = FileProcessor.process(file)
        end
      end
    end
  end
end
