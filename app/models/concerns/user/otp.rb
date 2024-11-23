module User::Otp
  extend ActiveSupport::Concern

  included do
    before_create :assign_otp_secret
  end

  def generate_new_otp!
    increment!(:otp_counter)
    update!(otp_expires_at: DateTime.current + 10.minutes)
    otp
  end

  def otp
    Otp.new(user: self).to_s
  end

  private

  def assign_otp_secret
    self.otp_secret ||= ROTP::Base32.random_base32 # Generate a unique secret for each user
  end
end
