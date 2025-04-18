module FileProcessor
  def self.process(file)
    case file
    when ActionDispatch::Http::UploadedFile
      blob = ActiveStorage::Blob.create_and_upload!(
        io: file.tempfile,
        filename: file.original_filename,
        content_type: file.content_type
      )
      blob.signed_id
    when String # blob.signed_id
      blob = ActiveStorage::Blob.find_signed!(file)
      {
        "filename" => blob.filename,
        "key" => blob.key,
        "url" => generate_url(blob)
      }
    when ActionController::Parameters, Hash # { filename:, url:, key: }
      blob = ActiveStorage::Blob.find_by!(key: file["key"])
      blob.signed_id
    when ActiveStorage::Attachment
      {
        "filename" => file.filename.to_s,
        "url" => generate_url(file),
        "key" => file.key
      }
    else
      raise ArgumentError, "Unsupported file type: #{file.class.name}"
    end
  end

  def self.generate_url(blob)
    Rails.application.routes.url_helpers.rails_blob_url(
      blob,
      host: Rails.application.config.action_mailer.default_url_options[:host],
      port: Rails.application.config.action_mailer.default_url_options[:port]
    )
  end

  # Downloads a file from a URL and stores it using ActiveStorage
  # Returns the signed_id of the created blob or nil if download fails
  # your_model.your_attachment.attach(FileProcessor.download_from_url(url))
  def self.download_from_url(url, formats: nil)
    return nil if url.blank?

    begin
      url = url.gsub(/\/$/, "")
      uri = URI.parse(url)
      # Extract filename from URL or use a default name
      filename = File.basename(uri.path)
      filename = "fichier_téléchargé" if filename.blank?

      # Determine content type based on file extension
      content_type = case File.extname(filename).downcase
      when ".png" then "image/png"
      when ".svg" then "image/svg+xml"
      when ".webp" then "image/webp"
      when ".pdf" then "application/pdf"
      when ".doc" then "application/msword"
      when ".docx" then "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      when ".xls" then "application/vnd.ms-excel"
      when ".xlsx" then "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      when ".ppt" then "application/vnd.ms-powerpoint"
      when ".pptx" then "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      else "application/octet-stream"
      end

      # If formats is provided, check if the content type is allowed
      if formats.present?
        unless formats.include?(content_type)
          Rails.logger.error("Unsupported file format: #{File.extname(filename)} for allowed formats: #{formats.join(", ")}")
          return nil
        end
      end

      # Download the file from the URL using Net::HTTP instead of URI.open
      response = Net::HTTP.get_response(uri)

      unless response.is_a?(Net::HTTPSuccess)
        raise "Failed to download file: #{response}"
      end

      downloaded_file = StringIO.new(response.body)

      # Create and upload the blob
      blob = ActiveStorage::Blob.create_and_upload!(
        io: downloaded_file,
        filename: filename,
        content_type: content_type
      )

      # Return the signed_id of the blob
      blob.signed_id
    rescue URI::InvalidURIError
      Rails.logger.error("Invalid URL: #{url}")
      nil
    rescue => e
      # if need to deal with redirects, we can use the following code:
      # https://github.com/Benefactorum/app/pull/212#discussion_r1979466775
      Rails.logger.error("Failed to download file from #{url}: #{e.message}")
      nil
    end
  end
end
