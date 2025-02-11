class UpdateContributionCheckConstraint < ActiveRecord::Migration[8.0]
  def change
    remove_check_constraint :contributions, name: "body_required_for_specific_types"
    add_check_constraint :contributions, "NOT (contributable_type IN (#{OTHER_CONTRIBUTABLE_TYPES.join(", ")})) OR (body IS NOT NULL AND body <> '')", name: "body_required_for_specific_types"
  end
end
