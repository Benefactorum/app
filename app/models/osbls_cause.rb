class OsblsCause < ApplicationRecord
  belongs_to :osbl
  belongs_to :cause

  # validates :osbl_id, uniqueness: { scope: :cause_id }
end
