class FundSource < ApplicationRecord
  belongs_to :annual_finance

  enum :type, {
    :dons => 0,
    :argent_publique => 1,
    :activité_commerciale => 2,
    :autres => 3
  }

  # validates :type, presence: true
  # validates :percent, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 100 }
  # validates :value, numericality: { greater_than: 0 }, allow_nil: true
end
