module Otp
  extend ActiveSupport::Concern

  included do
    before_create :assign_otp_secret
  end

  def send_otp_email(expiration_check: true)
    return false if expiration_check && otp_still_valid?

    otp = generate_new_otp
    UserMailer.with(user: self, otp:).otp.deliver_later
    true
  end

  def generate_new_otp
    increment!(:otp_counter)
    update!(otp_expires_at: DateTime.current + 10.minutes)
    otp
  end

  def otp
    ROTP::HOTP.new(otp_secret).at(otp_counter)
  end

  private

  def assign_otp_secret
    self.otp_secret ||= ROTP::Base32.random_base32 # Generate a unique secret for each user/business
  end

  def otp_still_valid?
    !!otp_expires_at&.after?(DateTime.current)
  end
end
