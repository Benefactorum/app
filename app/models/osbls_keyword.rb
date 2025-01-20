class OsblsKeyword < ApplicationRecord
  belongs_to :osbl
  belongs_to :keyword

  # validates :osbl_id, uniqueness: { scope: :keyword_id }
end
