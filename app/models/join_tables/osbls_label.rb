class JoinTables::OsblsLabel < ApplicationRecord
  belongs_to :osbl
  belongs_to :label, class_name: "Osbl::Label"

  # validates :osbl_id, uniqueness: { scope: :label_id }
end
