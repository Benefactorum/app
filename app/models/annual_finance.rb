class AnnualFinance < ApplicationRecord
  belongs_to :osbl
  has_many :fund_sources, dependent: :destroy

  validates :year, numericality: {less_than_or_equal_to: Time.current.year}
  # validates :employees_count, numericality: { greater_than: 0 }, allow_nil: true

  accepts_nested_attributes_for :fund_sources

  validate :at_least_one_information

  private

  def at_least_one_information
    return if fund_sources.any?

    attributes_to_check = attributes.except("id", "year", "osbl_id", "created_at", "updated_at")
    if attributes_to_check.values.all?(&:blank?)
      errors.add(:base, "Au moins une information est requise en plus de l'année.")
    end
  end
end
