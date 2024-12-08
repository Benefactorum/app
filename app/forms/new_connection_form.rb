class NewConnectionForm
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :email

  validates :email, presence: true
  validates :email, format: {with: URI::MailTo::EMAIL_REGEXP}, if: -> { email.present? }

  def submit
    return false unless valid?

    if (user = User.find_by(email: email))
      Otp.new(user: user).send_email
      :existing_user
    else
      :new_user
    end
  end
end
