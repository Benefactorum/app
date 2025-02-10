class Osbl::Cause < ApplicationRecord
  self.table_name = "causes"

  has_many :osbls_causes, dependent: :destroy, class_name: "Osbl::JoinTables::OsblsCause"
  has_many :osbls, through: :osbls_causes

  # validates :name, presence: true, uniqueness: true
end
