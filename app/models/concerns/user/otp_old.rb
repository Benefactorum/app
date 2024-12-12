module User::Otp
  extend ActiveSupport::Concern

  included do
    before_create :assign_otp_secret
  end

  def otp
    @otp ||= Otp.new(self)
  end

  private

  def assign_otp_secret
    self.otp_secret ||= ROTP::Base32.random_base32 # Generate a unique secret for each user
  end
end
