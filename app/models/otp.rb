class Otp
  include ActiveModel::Validations

  attr_reader :user
  attr_reader :client

  def initialize(user)
    @user = user
    @client = ROTP::HOTP.new(user.otp_secret)
  end

  def code
    client.at(user.otp_counter)
  end

  def verify?(code)
    unless client.verify(code, user.otp_counter)
      errors.add(:code, "Code de connexion invalide.")
      return false
    end

    if expired?
      # beware changing the error message, it's used in the front-end
      errors.add(:code, "Votre code de connexion a expiré. Demandez-en un nouveau.")
      return false
    end

    true
  end

  def destroy!
    user.update!(otp_expires_at: DateTime.current)
  end

  def create!
    user.increment!(:otp_counter)
    user.update!(otp_expires_at: DateTime.current + 10.minutes)
    self
  end

  def still_valid?
    !!user.otp_expires_at&.after?(DateTime.current)
  end

  def expired?
    !still_valid?
  end
end
