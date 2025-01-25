class FundAllocation < ApplicationRecord
  self.inheritance_column = nil

  belongs_to :annual_finance

  enum :type, {
    missions_sociales: 0,
    frais_de_fonctionnement: 1,
    frais_de_recherche_de_fonds: 2,
    autre: 3
    # dons_des_particuliers: 4,
    # mécénat: 5,
    # fonds_dédiés: 6,
    # activité_commerciale: 7
  }.freeze

  # validates :type, presence: true
  # validates :percent, presence: true, numericality: { greater_than: 0, less_than_or_equal_to: 100 }
  # validates :value, numericality: { greater_than: 0 }, allow_nil: true
  # validates :annual_finance_id, uniqueness: { scope: :type }
end
