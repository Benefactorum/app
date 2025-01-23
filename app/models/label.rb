class Label < ApplicationRecord
  has_many :osbls_labels, dependent: :destroy
  has_many :osbls, through: :osbls_labels

  has_one_attached :logo
end
