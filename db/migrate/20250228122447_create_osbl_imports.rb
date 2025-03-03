class CreateOsblImports < ActiveRecord::Migration[8.0]
  def change
    create_table :osbl_imports do |t|
      t.string :osbl_uri, null: false
      t.string :firecrawl_job_id, null: false
      t.json :extracted_data
      t.references :user, null: false, foreign_key: true
      t.references :contribution, foreign_key: true
      t.integer :status, null: false, default: 0 # initialized
      t.timestamps
    end
  end
end
