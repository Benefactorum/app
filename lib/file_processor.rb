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
        filename: blob.filename,
        url: generate_url(blob)
      }
    when ActionController::Parameters, Hash
      blob = ActiveStorage::Blob.find_by!(filename: file["filename"])
      blob.signed_id
    when ActiveStorage::Attachment
      {
        "filename" => file.filename.to_s,
        "url" => generate_url(file)
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
end
