class ModifyForeignKeyOnLocations < ActiveRecord::Migration[8.0]
  def change
    remove_foreign_key :locations, :osbls
    add_foreign_key :locations, :osbls, on_delete: :cascade
  end
end
