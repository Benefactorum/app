class Contribution < ApplicationRecord
  include AttachableValidation

  belongs_to :user

  enum :status, {
    :brouillon => 0,
    :"en attente de revue" => 1,
    :"en cours de revue" => 2,
    :validée => 3,
    :rejetée => 4
  }

  delegated_type :contributable, types: %w[
    Contribution::OsblCreation
    Contribution::OsblUpdate
    Contribution::Feedback
    Contribution::FeatureRequest
    Contribution::BugReport
    Contribution::CorrectionRequest
    Contribution::Other
  ], dependent: :destroy

  has_many_attached :files

  validates_attachments(
    name: :files,
    max_size: 5.megabytes
  )

  validate :files_count_within_limit

  # db_constraints enforcing :
  # validates :body, presence: true, if: -> { %w[Feedback FeatureRequest BugReport CorrectionRequest Other].include?(contributable_type) }

  def serialize
    ContributionSerializer.new(self).as_json
  end

  private

  def files_count_within_limit
    return unless files.attached?

    if files.count > 5
      errors.add(:files, "5 fichiers maximum.")
    end
  end
end
