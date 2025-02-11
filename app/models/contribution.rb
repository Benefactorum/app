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

  OSBL_CONTRIBUTABLE_TYPES = %w[
    Contribution::OsblCreation
    Contribution::OsblUpdate
  ]

  OTHER_CONTRIBUTABLE_TYPES = %w[
    Contribution::Feedback
    Contribution::FeatureRequest
    Contribution::BugReport
    Contribution::CorrectionRequest
    Contribution::Other
  ]

  CONTRIBUTABLE_TYPES = OSBL_CONTRIBUTABLE_TYPES + OTHER_CONTRIBUTABLE_TYPES

  delegated_type :contributable, types: CONTRIBUTABLE_TYPES, dependent: :destroy

  has_many_attached :files

  concerning :WithOsblData do
    included do
      scope :with_osbl_data, -> { with_osbl_joins.add_osbl_data }
      scope :with_osbl_names, -> { with_osbl_joins.add_osbl_names }

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

      scope :add_osbl_names, -> do
        add_osbl_field("name")
      end

      scope :add_osbl_field, ->(field_name) do
        select(
          "contributions.*",
          sanitize_sql_array([
            "COALESCE(json_extract(contribution_osbl_creations.osbl_data, ?),
                     json_extract(contribution_osbl_updates.osbl_data, ?)) as osbl_#{field_name}",
            "$.#{field_name}",
            "$.#{field_name}"
          ])
        )
      end

      def self.filter_by_osbl_json_value(key, value)
        where(
          sanitize_sql_array([
            "COALESCE(json_extract(contribution_osbl_creations.osbl_data, ?),
                    json_extract(contribution_osbl_updates.osbl_data, ?)) = ?",
            "$.#{key}", "$.#{key}", value
          ])
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
