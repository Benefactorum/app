class Osbl::Cause < ApplicationRecord
  has_many :osbls_causes, dependent: :destroy, class_name: "JoinTables::OsblsCause"
  has_many :osbls, through: :osbls_causes

  # validates :name, presence: true, uniqueness: true

  LIST = [
    "Environnement",
    "Protection de l'enfance",
    "Santé",
    "Lutte contre la précarité",
    "Éducation",
    "Protection animale",
    "Recherche",
    "Arts, Culture, Patrimoine",
    "Aide internationale",
    "Handicap",
    "Justice sociale",
    "Religion",
    "Autre"
  ].freeze
end
