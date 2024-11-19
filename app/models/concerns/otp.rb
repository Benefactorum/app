module Otp
  extend ActiveSupport::Concern

  included do
    before_create :assign_otp_secret
  end

  def send_otp_email(expiration_check: true)
    return if expiration_check && otp_still_valid?

    self.increment!(:otp_counter)
    otp_code = ROTP::HOTP.new(otp_secret).at(otp_counter)
    self.update!(otp_expires_at: DateTime.current + 10.minutes)
    UserMailer.with(user: self, otp: otp_code).otp.deliver_later
    true
  end

  private

  def assign_otp_secret
    self.otp_secret ||= ROTP::Base32.random_base32 # Generate a unique secret for each user/business
  end

  def otp_still_valid?
    !!otp_expires_at&.after?(DateTime.current)
  end
end
