class Osbl < ApplicationRecord
  include AttachableValidation

  has_one_attached :logo

  has_many :osbls_causes, dependent: :destroy # join table
  has_many :causes, through: :osbls_causes

  has_many :osbls_labels, dependent: :destroy # join table
  has_many :labels, through: :osbls_labels

  has_many :osbls_keywords, dependent: :destroy # join table
  has_many :keywords, through: :osbls_keywords

  has_many :osbls_intervention_areas, dependent: :destroy # join table
  has_many :intervention_areas, through: :osbls_intervention_areas

  has_many :annual_finances, dependent: :destroy
  has_one :latest_finance, -> { order(year: :desc) }, class_name: "AnnualFinance"

  has_many :document_attachments, as: :attachable, dependent: :destroy # join table
  has_many :documents, through: :document_attachments

  TAX_REDUCTION_VALUES = {
    "intérêt_général" => 0.66,
    "aide_aux_personnes_en_difficulté" => 0.75
  }.freeze

  enum :tax_reduction, {
    "intérêt_général" => 0,
    "aide_aux_personnes_en_difficulté" => 1
  }

  enum :geographical_scale, {
    "local" => 0,
    "regional" => 1,
    "national" => 2,
    "international" => 3
  }

  enum :osbl_type, {
    "association" => 0,
    "fonds_de_dotation" => 1,
    "fondation" => 2
  }

  validates :name, presence: true, uniqueness: true
  validates :website, uniqueness: true, allow_nil: true
  validates :description, length: {maximum: 300}, allow_nil: true
  validates :creation_year, numericality: {less_than_or_equal_to: Time.current.year}, allow_nil: true
  # validates :contact_email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_nil: true
  validates_attachment(
    name: :logo,
    max_size: 1.megabytes,
    content_types: %w[image/png image/svg image/webp]
  )

  accepts_nested_attributes_for :osbls_causes # , allow_destroy: true
  accepts_nested_attributes_for :osbls_labels # , allow_destroy: true
  accepts_nested_attributes_for :osbls_keywords # , allow_destroy: true
  accepts_nested_attributes_for :osbls_intervention_areas # , allow_destroy: true
  accepts_nested_attributes_for :annual_finances
  accepts_nested_attributes_for :document_attachments
end
