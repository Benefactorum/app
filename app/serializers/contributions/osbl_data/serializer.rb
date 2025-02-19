module Contributions
  module OsblData
    class Serializer
      def initialize(params)
        @params = params
      end

      def call
        transform_logo!
        transform_documents!
        transform_labels!
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
        when Hash, ActionController::Parameters
          attachments.each do |_, attachment|
            attachment["document_attributes"]["file"] = FileProcessor.process(attachment["document_attributes"]["file"])
          end
        else
          raise "Unknown class: #{attachments.class.name}"
        end
      end

      def transform_labels!
        return if @params["osbls_labels_attributes"].blank?

        @params["osbls_labels_attributes"].each do |label_attrs|
          label = Osbl::Label.find(label_attrs["label_id"])
          label_attrs["logo_url"] = FileProcessor.generate_url(label.logo.blob)
        end
      end
    end
  end
end
