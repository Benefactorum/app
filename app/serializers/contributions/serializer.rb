module Contributions
  class Serializer
    def initialize(contribution)
      @contribution = contribution
    end

    def call
      {
        id: @contribution.id,
        body: @contribution.body,
        files: serialized_files,
        osbl: serialized_osbl
      }
    end

    private

    def serialized_files
      @contribution.files.each_with_object({}).with_index do |(attachment, hash), index|
        hash[index] = FileProcessor.process(attachment)
      end
    end

    def serialized_osbl
      return if @contribution.osbl_data.nil?

      OsblData::Serializer.new(@contribution.osbl_data).call
    end
  end
end
