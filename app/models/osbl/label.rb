class Osbl::Label < ApplicationRecord
  include AttachableValidation

  LIST = %w[
    Don en confiance
    Label ideas
  ]

  has_many :osbls_labels, dependent: :destroy, class_name: "JoinTables::OsblsLabel"
  has_many :osbls, through: :osbls_labels

  has_one_attached :logo

  validates_attachment(
    name: :logo,
    max_size: 5.megabytes,
    content_types: %w[image/svg+xml image/png image/webp]
  )
end
