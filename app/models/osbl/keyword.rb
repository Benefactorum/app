class Osbl::Keyword < ApplicationRecord
  has_many :osbls_keywords, dependent: :destroy, class_name: "JoinTables::OsblsKeyword"
  has_many :osbls, through: :osbls_keywords
  # validates :name, presence: true, uniqueness: true, length: {minimum: 3, maximum: 100}

  normalizes :name, with: ->(name) { name.strip.downcase.capitalize }
end
