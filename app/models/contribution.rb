class Contribution < ApplicationRecord
  belongs_to :user
  delegated_type :contributable, types: %w[
    OsblCreation
    OsblUpdate
    Discussion
    BugReport
    CorrectionRequest
  ]

  has_many :documents # , dependent: :destroy ## what would happen if a document was also used for an Osbl
end
