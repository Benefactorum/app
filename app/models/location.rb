class Location < ApplicationRecord
  self.inheritance_column = nil

  belongs_to :osbl
  has_one :address, as: :addressable, dependent: :destroy

  enum :type, {
    siege_social: 0,
    antenne_locale: 1,
    lieu_d_activite: 2,
    autre: 3
  }.freeze

  validates :address, presence: true
  # validates :type, presence: true
  # validates :name, exclusion: {in: [""]}, allow_nil: true
  # validates :name, presence: true, if: -> { type.in?(%i[antenne_locale lieu_d_activite autre]) }
  # validates :osbl, uniqueness: {scope: :type, if: -> { type == "siege_social" }}

  accepts_nested_attributes_for :address
end
