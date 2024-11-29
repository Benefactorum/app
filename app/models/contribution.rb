class Contribution < ApplicationRecord
  belongs_to :user
  delegated_type :contributable, types: %w[
    OsblCreation
    OsblUpdate
    Discussion
    BugReport
    CorrectionRequest
  ]

  has_many :documents, dependent: :destroy
end
