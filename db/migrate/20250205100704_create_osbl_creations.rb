class CreateOsblCreations < ActiveRecord::Migration[8.0]
  def change
    create_table :osbl_creations do |t| # standard:disable Rails/CreateTableWithTimestamps
      t.text :osbl_data, null: false
    end
  end
end
