class ModifyAddressIndex < ActiveRecord::Migration[8.0]
  def up
    remove_index :addresses, name: "index_addresses_on_latitude_and_longitude"
    add_index :addresses, [:latitude, :longitude], name: "index_addresses_on_latitude_and_longitude", where: "addressable_type = 'Osbl::Location'"
  end

  def down
    remove_index :addresses, name: "index_addresses_on_latitude_and_longitude"
    add_index :addresses, [:latitude, :longitude], name: "index_addresses_on_latitude_and_longitude", where: "addressable_type = 'Location'"
  end
end
