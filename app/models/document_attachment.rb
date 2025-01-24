class DocumentAttachment < ApplicationRecord
  belongs_to :document
  belongs_to :attachable, polymorphic: true

  # validates :document_id, uniqueness: {scope: [:attachable_type, :attachable_id]}

  accepts_nested_attributes_for :document
end
