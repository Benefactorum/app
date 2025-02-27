class Contribution::OsblCreation < ApplicationRecord
  STATUS = {
    "brouillon" => 0,
    "en cours de validation" => 1,
    "nécessite des changements" => 2,
    "validé" => 3,
    "rejeté" => 4
  }.freeze

  # db_constraints enforcing :
  # validates :osbl_data, presence: true
end
