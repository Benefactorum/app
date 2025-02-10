class Osbl::JoinTables::OsblsKeyword < ApplicationRecord
  self.table_name = "osbls_keywords"
  belongs_to :osbl
  belongs_to :keyword, class_name: "Osbl::Keyword"

  # validates :osbl_id, uniqueness: { scope: :keyword_id }
end
