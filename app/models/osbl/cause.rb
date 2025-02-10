class Osbl::Cause < ApplicationRecord
  has_many :osbls_causes, dependent: :destroy, class_name: "JoinTables::OsblsCause"
  has_many :osbls, through: :osbls_causes

  # validates :name, presence: true, uniqueness: true
end
