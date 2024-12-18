class AddEmailFormatConstraintToUsers < ActiveRecord::Migration[8.0]
  def change
    add_check_constraint :users, "email LIKE '%_@_%._%'", name: "email_format_check"
  end
end
