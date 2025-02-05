class Document < ApplicationRecord
  include AttachableValidation

  self.inheritance_column = nil

  has_one_attached :file

  has_many :document_attachments, dependent: :destroy # join table
  # has_many :attachables, through: :document_attachments, source_type: "Osbl"

  enum :type, {
    "Statuts" => 0,
    "Rapport d'activité" => 1,
    "Rapport financier" => 2,
    "Procès verbal" => 3,
    "Autre" => 4
  }.freeze

  validates :file, presence: true
  validates_attachment(
    name: :file,
    max_size: 5.megabytes,
    content_types: %w[application/pdf]
  )
  validates :year, numericality: {less_than_or_equal_to: Time.current.year}, if: -> { year.present? }
  # validates :year, numericality: {greater_than: 999}, if: -> { year.present? }
  # validates :type, presence: true
  # validates :year, presence: true, if: -> { type.in?(%i[rapport_activite rapport_financier]) }
  # validates :name, presence: true, if: -> { type.in?(%i[proces_verbal autre]) }
end
