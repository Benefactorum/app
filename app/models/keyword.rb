class Keyword < ApplicationRecord
  has_many :osbls_keywords, dependent: :destroy # join table
  has_many :osbls, through: :osbls_keywords

  validates :name, presence: true, uniqueness: true, length: {minimum: 3, maximum: 30}

  normalizes :name, with: ->(name) { name.strip.downcase.capitalize }
end
