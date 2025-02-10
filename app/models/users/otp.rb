class Users::Otp < ApplicationRecord
  EXPIRATION_TIME = 10.minutes

  belongs_to :user

  before_create :assign_secret

  def still_valid?
    !used? && !expired?
  end

  def generate_new_code!
    transaction do
      increment!(:counter)
      update!(used: false)
    end
    code
  end

  def code
    client.at(counter)
  end

  def verify?(code)
    unless client.verify(code, counter)
      errors.add(:code, "Code de connexion invalide.")
      return false
    end

    unless still_valid?
      # beware changing the error message, it's used in the front-end
      errors.add(:code, "Votre code de connexion a expiré. Demandez-en un nouveau.")
      return false
    end

    true
  end

  def revoke!
    update!(used: true)
  end

  private

  def client
    @client ||= ROTP::HOTP.new(secret)
  end

  def assign_secret
    self.secret = ROTP::Base32.random_base32
  end

  def expired?
    updated_at < EXPIRATION_TIME.ago
  end
end
