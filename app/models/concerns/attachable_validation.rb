module AttachableValidation
  extend ActiveSupport::Concern

  class_methods do
    def validates_attachment(name:, max_size:, content_types: nil)
      validate do
        attachment = send(name)
        validate_single_attachment(attachment, name, max_size, content_types) if attachment.attached?
      end
    end

    def validates_attachments(name:, max_size:, content_types: nil)
      validate do
        attachments = send(name)
        if attachments.attached?
          attachments.each do |attachment|
            validate_single_attachment(attachment, name, max_size, content_types)
          end
        end
      end
    end
  end

  private

  def validate_single_attachment(attachment, name, max_size, content_types)
    validate_attachment_size(attachment, name, max_size)
    validate_attachment_content_type(attachment, name, content_types) if content_types.present?
  end

  def validate_attachment_size(attachment, name, max_size)
    if attachment.blob.byte_size > max_size
      errors.add(name, "la taille du fichier doit être inférieure à #{max_size / 1.megabyte} MB")
    end
  end

  def validate_attachment_content_type(attachment, name, content_types)
    unless attachment.content_type.in?(content_types)
      formatted_types = content_types.map { |type| type.split("/").last.upcase }.join(", ")
      errors.add(name, "le fichier doit être de type : #{formatted_types}")
    end
  end
end
