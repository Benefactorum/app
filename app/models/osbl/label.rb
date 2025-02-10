class Osbl::Label < ApplicationRecord
  include AttachableValidation

  has_many :osbls_labels, dependent: :destroy, class_name: "JoinTables::OsblsLabel"
  has_many :osbls, through: :osbls_labels

  has_one_attached :logo

  validates_attachment(
    name: :logo,
    max_size: 1.megabytes,
    content_types: %w[image/svg+xml image/png image/webp]
  )
end
