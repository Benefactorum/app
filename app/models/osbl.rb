class Osbl < ApplicationRecord
  include Osbl::Logo

  validates :name, presence: true, uniqueness: true
  validates :website, uniqueness: true
end
