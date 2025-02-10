class Osbl::Keyword < ApplicationRecord
  self.table_name = "keywords"

  has_many :osbls_keywords, dependent: :destroy, class_name: "Osbl::JoinTables::OsblsKeyword"
  has_many :osbls, through: :osbls_keywords

  # validates :name, presence: true, uniqueness: true, length: {minimum: 3, maximum: 100}

  normalizes :name, with: ->(name) { name.strip.downcase.capitalize }
end
