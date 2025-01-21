class AnnualFinance < ApplicationRecord
  validates :year, numericality: {less_than_or_equal_to: Time.current.year}
  # validates :employees_count, numericality: { greater_than: 0 }, allow_nil: true
end
