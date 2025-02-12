class OsblDataTransformer
  def initialize(params, mode)
    @params = params.to_h
    @mode = mode
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

    @params["document_attachments_attributes"].each do |_, attachment|
      attachment["document_attributes"]["file"] = process_file(attachment["document_attributes"]["file"])
    end
  end

  def process_file(uploaded_file)
    if @mode == :in
      blob = ActiveStorage::Blob.create_and_upload!(
        io: uploaded_file.tempfile,
        filename: uploaded_file.original_filename,
        content_type: uploaded_file.content_type
      )
      blob.signed_id
    elsif @mode == :out
      blob = ActiveStorage::Blob.find_signed(uploaded_file)
      {
        filename: blob.filename,
        url: Rails.application.routes.url_helpers.rails_blob_url(blob, only_path: true)
      }
    end
  end
end
