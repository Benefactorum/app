class CreateOsblImports < ActiveRecord::Migration[8.0]
  def change
    create_table :osbl_imports do |t|
      t.string :osbl_uri, null: false
      t.json :extracted_data, null: false
      t.timestamps
    end
  end
end
