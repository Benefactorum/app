module Osbl::Logo
  extend ActiveSupport::Concern

  MAX_LOGO_SIZE = 1.megabytes
  ALLOWED_CONTENT_TYPES = %w[image/png image/svg image/webp].freeze

  included do
    has_one_attached :logo

    validate :validate_logo, if: -> { logo.attached? }
  end

  private

  def validate_logo
    if logo.blob.byte_size > MAX_LOGO_SIZE
      errors.add(:logo, "la taille du fichier doit être inférieure à #{MAX_LOGO_SIZE / 1.megabyte} MB")
    end

    unless logo.content_type.in?(ALLOWED_CONTENT_TYPES)
      errors.add(:logo, "le fichier doit être de type : #{formatted_allowed_content_types}")
    end
  end

  def formatted_allowed_content_types
    ALLOWED_CONTENT_TYPES.map { |type| type.split("/").last.upcase }.join(", ")
  end
end
