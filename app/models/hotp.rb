class Hotp
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :user
  attribute :code

  validates :user, presence: true
  validates :code, presence: true
  validate :validate_code


  private

  def validate_code
    return unless user && code

    client = ROTP::HOTP.new(user.otp_secret)

    unless client.verify(code, user.otp_counter)
      errors.add(:code, "Code de connexion invalide.")
    end

    if otp_expired?
      errors.add(:code, "Votre code de connexion a expiré. Demandez-en un nouveau.")
    end
  end

  def otp_expired?
    DateTime.current > user.otp_expires_at
  end
end
