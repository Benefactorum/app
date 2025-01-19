class CreateJoinTableOsblCause < ActiveRecord::Migration[8.0]
  def change
    create_table :osbls_causes do |t| # standard:disable Rails/CreateTableWithTimestamps
      t.integer :osbl_id, null: false
      t.integer :cause_id, null: false

      t.index [:osbl_id, :cause_id], unique: true
      t.index [:cause_id, :osbl_id], unique: true

      t.foreign_key :osbls, column: :osbl_id, on_delete: :cascade
      t.foreign_key :causes, column: :cause_id, on_delete: :cascade
    end
  end
end
