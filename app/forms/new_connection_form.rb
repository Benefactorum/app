class NewConnectionForm
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :email

  validates :email, presence: true
  validates :email, format: {with: URI::MailTo::EMAIL_REGEXP}, if: -> { email.present? }

  def submit
    return false unless valid?

    if (user = User.find_by(email: email))
      UserMailer.with(user:).otp.deliver_later unless user.otp&.still_valid?
      :existing_user
    else
      :new_user
    end
  end
end
