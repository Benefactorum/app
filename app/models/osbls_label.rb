class OsblsCause < ApplicationRecord
  belongs_to :osbl
  belongs_to :label

  # validates :osbl_id, uniqueness: { scope: :label_id }
end
