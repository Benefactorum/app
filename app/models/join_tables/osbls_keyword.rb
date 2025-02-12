class JoinTables::OsblsKeyword < ApplicationRecord
  belongs_to :osbl
  belongs_to :keyword, class_name: "Osbl::Keyword"

  attribute :name, :string

  # validates :osbl_id, uniqueness: { scope: :keyword_id }
end
