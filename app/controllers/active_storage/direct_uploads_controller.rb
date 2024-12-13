# frozen_string_literal: true

# Creates a new blob on the server side in anticipation of a direct-to-service upload from the client side.
# When the client-side upload is completed, the signed_blob_id can be submitted as part of the form to reference
# the blob that was created up front.

# Monkey patch to allow direct uploads to be created within a subfolder based on RAILS_ENV
class ActiveStorage::DirectUploadsController < ActiveStorage::BaseController
  def create
    subfolder = params[:subfolder] || "uploads"
    subfolders = "#{Rails.env}/#{subfolder}"

    blob = ActiveStorage::Blob.create_before_direct_upload!(
      **blob_args,
      key: "#{subfolders}/#{SecureRandom.uuid}-#{blob_args[:filename]}"
    )
    render json: direct_upload_json(blob)
  end

  private

  def blob_args
    params.require(:blob).permit(:filename, :byte_size, :checksum, :content_type, metadata: {}).to_h.symbolize_keys
  end

  def direct_upload_json(blob)
    blob.as_json(root: false, methods: :signed_id).merge(direct_upload: {
      url: blob.service_url_for_direct_upload,
      headers: blob.service_headers_for_direct_upload
    })
  end
end
