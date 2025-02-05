class AddMoreConstraintToLocation < ActiveRecord::Migration[8.0]
  def change
    add_check_constraint :locations, "type NOT IN (1, 2, 3) OR (type IN (1, 2, 3) AND name IS NOT NULL)", name: "name_required_for_specific_types"
  end
end
