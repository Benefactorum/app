class CreateJoinTableOsblInterventionArea < ActiveRecord::Migration[8.0]
  def change
    create_table :osbls_intervention_areas do |t| # standard:disable Rails/CreateTableWithTimestamps
      t.integer :osbl_id, null: false
      t.integer :intervention_area_id, null: false

      t.index [:osbl_id, :intervention_area_id], unique: true
      t.index [:intervention_area_id, :osbl_id], unique: true

      t.foreign_key :osbls, column: :osbl_id, on_delete: :cascade
      t.foreign_key :intervention_areas, column: :intervention_area_id, on_delete: :cascade
    end
  end
end
