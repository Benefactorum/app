class OsblDataTransformer
  def initialize(params)
    @params = params.to_h
  end

  def transform
    transform_logo!
    transform_documents!
    @params
  end

  private

  def transform_logo!
    return if @params["logo"].blank?

    @params["logo"] = process_file(@params["logo"])
  end

  def transform_documents!
    return if @params["document_attachments_attributes"].blank?

    @params["document_attachments_attributes"].each do |index, attachment|
      if attachment.present?
        attachment["document_attributes"]["file"] = process_file(attachment["document_attributes"]["file"])
      else
        index["document_attributes"]["file"] = process_file(index["document_attributes"]["file"])
      end
    end
  end

  def process_file(file)
    case file.class.name
    when "ActionDispatch::Http::UploadedFile"
      blob = ActiveStorage::Blob.create_and_upload!(
        io: file.tempfile,
        filename: file.original_filename,
        content_type: file.content_type
      )
      blob.signed_id
    when "String"
      blob = ActiveStorage::Blob.find_signed(file)
      {
        filename: blob.filename,
        url: Rails.application.routes.url_helpers.rails_blob_url(blob, only_path: true)
      }
    when "ActiveSupport::HashWithIndifferentAccess"
      blob = ActiveStorage::Blob.find_by!(filename: file[:filename])
      blob.signed_id
    else
      debugger
    end
  end
end
