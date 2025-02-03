class AddCheckConstraintToInterventionAreas < ActiveRecord::Migration[8.0]
  def change
    add_check_constraint :intervention_areas, "length(name) >= 3 AND length(name) <= 100", name: "intervention_areas_name_length_check"
  end
end
