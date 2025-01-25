module AttachableValidation
  extend ActiveSupport::Concern

  class_methods do
    def validates_attachment(name:, max_size:, content_types:)
      validate do
        if send(name).attached?
          attachment = send(name)

          if attachment.blob.byte_size > max_size
            errors.add(name, "la taille du fichier doit être inférieure à #{max_size / 1.megabyte} MB")
          end

          unless attachment.content_type.in?(content_types)
            formatted_types = content_types.map { |type| type.split("/").last.upcase }.join(", ")
            errors.add(name, "le fichier doit être de type : #{formatted_types}")
          end
        end
      end
    end
  end
end
