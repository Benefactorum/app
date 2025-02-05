class AddStatusToContribution < ActiveRecord::Migration[8.0]
  def change
    add_column :contributions, :status, :integer, default: 0
    add_column :contributions, :body, :text, null: true

    add_check_constraint :contributions,
      "NOT (contributable_type IN ('Feedback', 'FeatureRequest', 'BugReport', 'CorrectionRequest', 'Other')) OR body IS NOT NULL",
      name: "body_required_for_specific_types"
  end
end
