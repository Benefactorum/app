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

  concerning :WithOsblData do
    included do
      scope :with_osbl_data, -> { with_osbl_joins.add_osbl_data }

      attribute :osbl_data, :json, default: nil

      private

      scope :with_osbl_joins, -> do
        joins(
          "LEFT JOIN contribution_osbl_creations ON contribution_osbl_creations.id = contributions.contributable_id
           AND contributions.contributable_type = 'Contribution::OsblCreation'
           LEFT JOIN contribution_osbl_updates ON contribution_osbl_updates.id = contributions.contributable_id
           AND contributions.contributable_type = 'Contribution::OsblUpdate'"
        )
      end

      scope :add_osbl_data, -> do
        select(
          "contributions.*",
          "COALESCE(contribution_osbl_creations.osbl_data, contribution_osbl_updates.osbl_data) as osbl_data"
        )
      end
    end
  end

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
