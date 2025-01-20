class Osbl < ApplicationRecord
  include Osbl::Logo

  has_many :osbls_causes, dependent: :destroy # join table
  has_many :causes, through: :osbls_causes

  has_many :osbls_keywords, dependent: :destroy # join table
  has_many :keywords, through: :osbls_keywords

  has_many :osbls_intervention_areas, dependent: :destroy # join table
  has_many :intervention_areas, through: :osbls_intervention_areas

  TAX_REDUCTION_VALUES = {
    "standard" => 0.66,
    "aide_aux_personnes_en_difficulté" => 0.75,
    "fondation_du_patrimoine" => 0.75
  }.freeze

  enum :tax_reduction, {
    "standard" => 0,
    "aide_aux_personnes_en_difficulté" => 1,
    "fondation_du_patrimoine" => 2
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
  # validates :employees_count, numericality: { greater_than: 0 }, allow_nil: true
  validates :creation_year, numericality: {less_than_or_equal_to: Time.current.year}, allow_nil: true # greater_than: 0,
  # validates :contact_email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_nil: true

  accepts_nested_attributes_for :osbls_causes # , allow_destroy: true
  accepts_nested_attributes_for :osbls_keywords # , allow_destroy: true
  accepts_nested_attributes_for :osbls_intervention_areas # , allow_destroy: true
end
