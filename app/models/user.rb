class User < ApplicationRecord
  before_create :assign_otp_secret

  has_secure_password validations: false

  generates_token_for :email_verification, expires_in: 2.days do
    email
  end

  generates_token_for :password_reset, expires_in: 20.minutes do
    password_salt.last(10)
  end


  belongs_to :account

  has_many :sessions, dependent: :destroy

  validates :email, presence: true
  validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }, if: -> { email.present? }
  validates :first_name, :last_name, :terms_and_privacy_accepted_at, presence: true
  validates :password, allow_nil: true, length: { minimum: 12 }

  normalizes :email, with: -> { _1.strip.downcase }

  before_validation if: :email_changed?, on: :update do
    self.verified = false
  end

  before_validation on: :create do
    self.account = Account.new
  end

  after_update if: :password_digest_previously_changed? do
    sessions.where.not(id: Current.session).delete_all
  end

  private

  def assign_otp_secret
    self.otp_secret ||= ROTP::Base32.random_base32 # Generate a unique secret for each user
  end
end
