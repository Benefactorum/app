module Contributions
  module OsblData
    class Serializer
      def initialize(params, mode = nil)
        @params = params
        @mode = mode
      end

      def call
        transform_logo!
        transform_documents!
        transform_labels! if @mode == :display
        @params
      end

      private

      def transform_logo!
        return if @params["logo"].blank?

        @params["logo"] = FileProcessor.process(@params["logo"])
      end

      def transform_documents!
        @params.fetch("document_attachments_attributes", []).each do |attachment|
          attachment["document_attributes"]["file"] = FileProcessor.process(attachment["document_attributes"]["file"])
        end
      end

      def transform_labels!
        return if @params["osbls_labels_attributes"].blank?

        if @params["osbls_labels_attributes"].is_a?(Array)
          @params["osbls_labels_attributes"].each do |label_attrs|
            label = Osbl::Label.find(label_attrs["label_id"])
            label_attrs["logo_url"] = FileProcessor.generate_url(label.logo.blob)
          end
        else
          @params["osbls_labels_attributes"].each do |key, label_attrs|
            label = Osbl::Label.find(label_attrs["label_id"])
            label_attrs["logo_url"] = FileProcessor.generate_url(label.logo.blob)
          end
        end
      end
    end
  end
end
