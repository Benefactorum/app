class Document < ApplicationRecord
  self.inheritance_column = nil

  has_one_attached :file

  has_many :document_attachments, dependent: :destroy # join table
  has_many :attachables, through: :document_attachments

  enum :type, {
    statuts: 0,
    rapport_activite: 1,
    rapport_financier: 2,
    proces_verbal: 3,
    autre: 4
  }.freeze

  validates :file, presence: true
  # validates :type, presence: true
  # validates :year, presence: true, if: -> { type.in?(%i[rapport_activite rapport_financier]) }
end
