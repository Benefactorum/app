class RemoveOtpFieldsFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :otp_secret, :string
    remove_column :users, :otp_counter, :integer
    remove_column :users, :otp_expires_at, :datetime
  end
end
