class CreateAddresses < ActiveRecord::Migration[8.0]
  def change
    create_table :addresses do |t|
      t.string :street_number
      t.string :street_name, null: false
      t.string :additional_info
      t.string :postal_code, null: false
      t.string :city, null: false
      t.string :country, null: false, default: "France"
      t.decimal :latitude, precision: 10, scale: 6, null: false
      t.decimal :longitude, precision: 10, scale: 6, null: false
      # t.references :addressable, polymorphic: true, null: false
      t.string "addressable_type", null: false
      t.integer "addressable_id", null: false, index: false # Disable automatic index

      t.timestamps
    end

    add_index :addresses, [:addressable_type, :addressable_id], unique: true
    add_index :addresses, [:latitude, :longitude], where: "addressable_type = 'Location'"
  end
end
