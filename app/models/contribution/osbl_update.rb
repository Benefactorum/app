class Contribution::OsblUpdate < ApplicationRecord
  serialize :osbl_data, coder: JSON

  # db_constraints enforcing :
  # validates :osbl_data, presence: true
end
