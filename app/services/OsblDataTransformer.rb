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

    @params["document_attachments_attributes"].each do |_, attachment|
      attachment["document_attributes"]["file"] = process_file(attachment["document_attributes"]["file"])
    end
  end

  def process_file(uploaded_file)
    blob = ActiveStorage::Blob.create_and_upload!(
      io: uploaded_file.tempfile,
      filename: uploaded_file.original_filename,
      content_type: uploaded_file.content_type
    )
    blob.signed_id
  end
end
