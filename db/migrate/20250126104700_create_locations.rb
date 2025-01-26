class CreateLocations < ActiveRecord::Migration[8.0]
  def change
    create_table :locations do |t|
      t.integer :type, null: false
      t.string :name
      t.text :description
      t.string :website

      t.timestamps

      t.references :osbl, null: false, foreign_key: true
    end

    # Add a partial unique index for siege_social type
    add_index :locations, :osbl_id, unique: true,
      where: "type = 0",
      name: "index_locations_on_osbl_id_siege_social"
  end
end
