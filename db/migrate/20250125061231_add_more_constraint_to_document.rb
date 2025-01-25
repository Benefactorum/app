class AddMoreConstraintToDocument < ActiveRecord::Migration[8.0]
  def change
    # required year for proces_verbal (3) and autre (4)
    add_check_constraint(
      :documents,
      "type NOT IN (3, 4) OR (type IN (3, 4) AND year IS NOT NULL)",
      name: "year_required_for_specific_types"
    )
  end
end
