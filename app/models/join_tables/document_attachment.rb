class JoinTables::DocumentAttachment < ApplicationRecord
  belongs_to :document
  belongs_to :attachable, polymorphic: true

  # validates :document_id, uniqueness: {scope: [:attachable_type, :attachable_id]}

  accepts_nested_attributes_for :document

  after_destroy :cleanup_orphaned_document

  private

  def cleanup_orphaned_document
    document.destroy! if document.document_attachments.empty?
  end
end
