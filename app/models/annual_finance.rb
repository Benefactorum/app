class AnnualFinance < ApplicationRecord
  has_many :fund_sources, dependent: :destroy

  validates :year, numericality: {less_than_or_equal_to: Time.current.year}
  # validates :employees_count, numericality: { greater_than: 0 }, allow_nil: true

  accepts_nested_attributes_for :fund_sources
end
