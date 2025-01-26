class RemoveContactEmailFromOsbl < ActiveRecord::Migration[8.0]
  def up
    remove_check_constraint :osbls, name: "contact_email_format_check"
    remove_column :osbls, :contact_email, :string
  end

  def down
    add_column :osbls, :contact_email, :string
    add_check_constraint :osbls, "contact_email IS NULL OR (contact_email IS NOT NULL AND contact_email LIKE '%_@_%._%')", name: "contact_email_format_check"
  end
end
