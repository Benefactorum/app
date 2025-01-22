class AddTaxReductionToOsbl < ActiveRecord::Migration[8.0]
  def change
    add_column :osbls, :tax_reduction, :integer, null: false
    add_column :osbls, :geographical_scale, :integer
    add_column :osbls, :employees_count, :integer
    add_column :osbls, :osbl_type, :integer
    add_column :osbls, :creation_year, :integer
    add_column :osbls, :contact_email, :string

    add_check_constraint :osbls, "employees_count >= 0", name: "employees_count_positive"
    add_check_constraint :osbls, "contact_email IS NULL OR (contact_email IS NOT NULL AND contact_email LIKE '%_@_%._%')", name: "contact_email_format_check"
    add_check_constraint :osbls, "creation_year >= 1000", name: "creation_year_as_4_digits"
  end
end
