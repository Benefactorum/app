class InterventionArea < ApplicationRecord
  has_many :osbls_intervention_areas, dependent: :destroy # join table
  has_many :osbls, through: :osbls_intervention_areas

  validates :name, presence: true, uniqueness: true

  normalizes :name, with: ->(name) { name.strip.downcase.capitalize }
end
