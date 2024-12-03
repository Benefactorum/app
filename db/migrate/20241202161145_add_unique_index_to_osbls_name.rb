class AddUniqueIndexToOsblsName < ActiveRecord::Migration[8.0]
  def change
    change_table :osbls do |t|
      t.string :website, index: {unique: true}
      t.text :description
    end

    change_column_null :osbls, :name, false
    add_index :osbls, :name, unique: true
  end
end
