class Osbl::JoinTables::OsblsCause < ApplicationRecord
  self.table_name = "osbls_causes"
  belongs_to :osbl
  belongs_to :cause, class_name: "Osbl::Cause"

  # validates :osbl_id, uniqueness: { scope: :cause_id }
end
