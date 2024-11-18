class AddFullNameToUser < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :first_name, :string, null: false
    add_column :users, :last_name, :string, null: false
    add_column :users, :terms_and_privacy_accepted_at, :datetime, null: false
  end
end
