class Address < ApplicationRecord
  belongs_to :addressable, polymorphic: true

  validates :street_name, :postal_code, :city, presence: true
end
