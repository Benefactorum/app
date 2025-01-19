class Osbl < ApplicationRecord
  include Osbl::Logo

  has_many :osbls_causes, dependent: :destroy # join table
  has_many :causes, through: :osbls_causes

  enum :tax_reduction, {
    "0.66" => 0,
    "0.75" => 1
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
  validates :website, uniqueness: true
  # validates :employees_count, numericality: { greater_than: 0 }, allow_nil: true
  validates :creation_year, numericality: {less_than_or_equal_to: Time.current.year}, allow_nil: true # greater_than: 0,
  # validates :contact_email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_nil: true

  accepts_nested_attributes_for :osbls_causes, allow_destroy: true
end
