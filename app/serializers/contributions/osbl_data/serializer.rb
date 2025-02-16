module Contributions
  module OsblData
    class Serializer
      def initialize(params)
        @params = params.to_h
      end

      def call
        transform_logo!
        transform_documents!
        @params
      end

      private

      def transform_logo!
        return if @params["logo"].blank?

        @params["logo"] = FileProcessor.process(@params["logo"])
      end

      def transform_documents!
        return if @params["document_attachments_attributes"].blank?

        attachments = @params["document_attachments_attributes"]

        case attachments
        when Array
          attachments.each do |attachment|
            attachment["document_attributes"]["file"] = FileProcessor.process(attachment["document_attributes"]["file"])
          end
        when Hash, ActiveSupport::HashWithIndifferentAccess
          attachments.each do |_, attachment|
            attachment["document_attributes"]["file"] = FileProcessor.process(attachment["document_attributes"]["file"])
          end
        else
          raise "Unknown class: #{attachments.class.name}"
        end
      end
    end
  end
end
