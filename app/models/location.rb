class Location < ApplicationRecord
  self.inheritance_column = nil

  belongs_to :osbl
  has_one :address, as: :addressable

  enum :type, {
    siege_social: 0,
    antenne_locale: 1,
    lieux_d_activite: 2,
    autre: 3
  }.freeze

  # validates :type, presence: true
  # validates :name, uniqueness: {scope: :osbl_id}, if: -> { type == "siege_social" }

  accepts_nested_attributes_for :address
end
