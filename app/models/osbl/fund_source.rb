class Osbl::FundSource < ApplicationRecord
  self.inheritance_column = nil

  belongs_to :annual_finance

  enum :type, {
    "Dons" => 0,
    "Aides publiques" => 1,
    "Revenus d'activités" => 2,
    "Autre" => 3
    # dons_des_particuliers: 4,
    # mécénat: 5,
    # fonds_dédiés: 6,
    # activité_commerciale: 7
  }.freeze

  validates :type, presence: true
  validates :percent, presence: true, numericality: {greater_than: 0, less_than_or_equal_to: 100}
  validates :amount, numericality: {greater_than_or_equal_to: 0}, allow_nil: true
  validates :annual_finance_id, uniqueness: {scope: :type}
end
