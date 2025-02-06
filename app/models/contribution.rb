class Contribution < ApplicationRecord
  include AttachableValidation

  belongs_to :user

  delegated_type :contributable, types: %w[
    OsblCreation
    OsblUpdate
    Feedback
    FeatureRequest
    BugReport
    CorrectionRequest
    Other
  ], dependent: :destroy

  has_many_attached :files

  validates_attachments(
    name: :files,
    max_size: 5.megabytes
  )

  validate :files_count_within_limit

  # db_constraints enforcing :
  # validates :body, presence: true, if: -> { %w[Feedback FeatureRequest BugReport CorrectionRequest Other].include?(contributable_type) }

  private

  def files_count_within_limit
    return unless files.attached?

    if files.count > 5
      errors.add(:files, "5 fichiers maximum.")
    end
  end
end
