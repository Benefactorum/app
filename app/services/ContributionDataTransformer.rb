class ContributionDataTransformer
  def initialize(contribution)
    @contribution = contribution
  end

  def transform
    {
      id: @contribution.id,
      body: @contribution.body,
      files: transform_files,
      osbl: transform_osbl
    }
  end

  private

  def transform_files
    @contribution.files.each_with_object({}).with_index do |(attachment, hash), index|
      hash[index] = {
        filename: attachment.filename.to_s,
        url: Rails.application.routes.url_helpers.rails_blob_url(attachment, only_path: true)
      }
    end
  end

  def transform_osbl
    return if @contribution.osbl_data.nil?

    OsblDataTransformer.new(@contribution.osbl_data).transform
  end
end
