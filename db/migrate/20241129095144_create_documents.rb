class CreateDocuments < ActiveRecord::Migration[8.0]
  def change
    create_table :documents do |t|
      t.references :contribution, foreign_key: true
      t.references :osbl, foreign_key: true
      t.integer :type, null: false
      t.string :name

      t.timestamps
    end
  end
end
