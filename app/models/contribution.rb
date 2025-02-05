class Contribution < ApplicationRecord
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

  # db_constraints enforcing :
  # validates :body, presence: true, if: -> { %w[Feedback FeatureRequest BugReport CorrectionRequest Other].include?(contributable_type) }
end
