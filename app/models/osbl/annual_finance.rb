class Osbl::AnnualFinance < ApplicationRecord
  belongs_to :osbl
  has_many :fund_sources, dependent: :destroy
  has_many :fund_allocations, dependent: :destroy

  accepts_nested_attributes_for :fund_sources
  accepts_nested_attributes_for :fund_allocations

  validates :year, numericality: {greater_than_or_equal_to: 1000, less_than_or_equal_to: Time.current.year}, allow_nil: true
  validates :employees_count, numericality: {greater_than_or_equal_to: 0}, allow_nil: true
  validates :budget, numericality: {greater_than_or_equal_to: 0}, allow_nil: true

  validate :at_least_one_information
  validate :fund_sources_total_percentage_is_100
  validate :fund_allocations_total_percentage_is_100

  private

  def at_least_one_information
    return if fund_sources.any?
    return if fund_allocations.any?

    attributes_to_check = attributes.except("id", "year", "osbl_id", "created_at", "updated_at")
    if attributes_to_check.values.all?(&:blank?)
      errors.add(:base, "Au moins une information est requise en plus de l'année.")
    end
  end

  def fund_sources_total_percentage_is_100
    return if fund_sources.empty?

    if fund_sources.sum(&:percent) != 100
      errors.add(:fund_sources, "La somme des pourcentages doit être exactement 100%.")
    end
  end

  def fund_allocations_total_percentage_is_100
    return if fund_allocations.empty?

    if fund_allocations.sum(&:percent) != 100
      errors.add(:fund_allocations, "La somme des pourcentages doit être exactement 100%.")
    end
  end
end
