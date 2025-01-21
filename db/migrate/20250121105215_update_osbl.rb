class UpdateOsbl < ActiveRecord::Migration[8.0]
  def up
    # Remove the employees_count column and its associated check constraint
    remove_check_constraint :osbls, name: "employees_count_positive"
    remove_column :osbls, :employees_count, :integer

    # Add public_utility column with default value false
    add_column :osbls, :public_utility, :boolean, default: false, null: false
  end

  def down
    # Remove the public_utility column
    remove_column :osbls, :public_utility, :boolean

    # Re-add the employees_count column and its check constraint
    add_column :osbls, :employees_count, :integer
    add_check_constraint :osbls, "employees_count >= 0", name: "employees_count_positive"
  end
end
