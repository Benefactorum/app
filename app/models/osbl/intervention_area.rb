class Osbl::InterventionArea < ApplicationRecord
  has_many :osbls_intervention_areas, dependent: :destroy, class_name: "JoinTables::OsblsInterventionArea"
  has_many :osbls, through: :osbls_intervention_areas

  # validates :name, presence: true, uniqueness: true, length: {minimum: 3, maximum: 100}

  normalizes :name, with: ->(name) { name.strip.downcase.capitalize }
end
