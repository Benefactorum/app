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

      @contribution.update!(
        processed_params.merge(
          contributable_attributes: {
            id: @contribution.contributable.id,
            osbl_data: osbl_data
          }
        )
      )

      [:ok, "Votre contribution a été modifiée."]
    end

    private

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
