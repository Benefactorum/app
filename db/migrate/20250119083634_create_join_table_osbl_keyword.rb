class CreateJoinTableOsblKeyword < ActiveRecord::Migration[8.0]
  def change
    create_table :osbls_keywords do |t| # standard:disable Rails/CreateTableWithTimestamps
      t.integer :osbl_id, null: false
      t.integer :keyword_id, null: false

      t.index [:osbl_id, :keyword_id], unique: true
      t.index [:keyword_id, :osbl_id], unique: true

      t.foreign_key :osbls, column: :osbl_id, on_delete: :cascade
      t.foreign_key :keywords, column: :keyword_id, on_delete: :cascade
    end
  end
end
