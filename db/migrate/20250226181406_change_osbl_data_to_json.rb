class ChangeOsblDataToJson < ActiveRecord::Migration[8.0]
  def up
    change_column :contribution_osbl_creations, :osbl_data, :json, null: false
    change_column :contribution_osbl_updates, :osbl_data, :json, null: false
  end

  def down
    # Specify the original data type to revert to
    change_column :contribution_osbl_creations, :osbl_data, :text, null: false
    change_column :contribution_osbl_updates, :osbl_data, :text, null: false
  end
end
