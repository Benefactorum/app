class JoinTables::OsblsCause < ApplicationRecord
  belongs_to :osbl
  belongs_to :cause, class_name: "Osbl::Cause"

  # validates :osbl_id, uniqueness: { scope: :cause_id }
end
