class Otp
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :user
  attribute :code

  validates :user, presence: true
  validates :code, presence: true
  validate :validate_code, if: -> { user && code }

  def send_email(expiration_check: true)
    return if expiration_check && otp_still_valid?

    user.generate_new_otp!
    UserMailer.with(user:).otp.deliver_later
  end

  def to_s
    ROTP::HOTP.new(user.otp_secret).at(user.otp_counter)
  end

  private

  def validate_code
    otp = ROTP::HOTP.new(user.otp_secret)

    unless otp.verify(code, user.otp_counter)
      errors.add(:code, "Code de connexion invalide.")
    end

    if otp_expired?
      errors.add(:code, "Votre code de connexion a expiré. Demandez-en un nouveau.")
    end
  end

  def otp_expired?
    !otp_still_valid?
  end

  def otp_still_valid?
    !!user.otp_expires_at&.after?(DateTime.current)
  end
end
