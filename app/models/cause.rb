class Cause < ApplicationRecord
  has_many :osbls_causes, dependent: :destroy
  has_many :osbls, through: :osbls_causes

  # validates :name, presence: true, uniqueness: true
end
