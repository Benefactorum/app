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

  def serialize
    ContributionSerializer.new(self).as_json
  end

  def type_label
    case contributable_type
    when "OsblCreation"
      "Ajouter #{contributable.osbl_data["name"]}"
    when "OsblUpdate"
      "Modifier #{contributable.osbl_data["name"]}"
    when "Feedback"
      "Retour d'expérience"
    when "FeatureRequest"
      "Suggestion"
    when "BugReport"
      "Rapport de bogue"
    when "CorrectionRequest"
      "Correctif"
    when "Other"
      "Autre"
    end
  end

  private

  def files_count_within_limit
    return unless files.attached?

    if files.count > 5
      errors.add(:files, "5 fichiers maximum.")
    end
  end
end
