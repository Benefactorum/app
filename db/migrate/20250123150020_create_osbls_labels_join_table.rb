class CreateOsblsLabelsJoinTable < ActiveRecord::Migration[8.0]
  def change
    create_table :osbls_labels do |t| # standard:disable Rails/CreateTableWithTimestamps
      t.integer :osbl_id, null: false
      t.integer :label_id, null: false

      t.index [:osbl_id, :label_id], unique: true
      t.index [:label_id, :osbl_id], unique: true

      t.foreign_key :osbls, column: :osbl_id, on_delete: :cascade
      t.foreign_key :labels, column: :label_id, on_delete: :cascade
    end
  end
end
