class AddOtpToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :otp_secret, :string, null: false
    add_column :users, :otp_counter, :integer, default: 0
    add_column :users, :otp_expires_at, :datetime
  end
end
