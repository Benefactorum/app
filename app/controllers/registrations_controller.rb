class RegistrationsController < ApplicationController
  skip_before_action :authenticate

  before_action :add_terms_and_privacy_accepted_at, only: [ :create ]

  rate_limit to: 5, within: 1.minute, only: :create

  def new
    render inertia: "Auth/SignUp"
  end

  def create
    user = User.new(user_params)

    if user.save
      send_otp_email(user)
      redirect_to sign_in_path
    else
      redirect_to sign_up_path, inertia: { errors: user.errors }
    end
  end

  private

    def add_terms_and_privacy_accepted_at
      if params[:accepts_conditions].present?
        params[:terms_and_privacy_accepted_at] = DateTime.current
      end
    end

    def user_params
      params.permit(:email, :first_name, :last_name, :terms_and_privacy_accepted_at)
    end

    def send_otp_email(user)
      # should I add a logic to not send another email if otp_expires_at is still valid ?
      user.increment!(:otp_counter)

      otp = ROTP::HOTP.new(user.otp_secret)
                      .at(user.otp_counter)

      user.update!(otp_expires_at: DateTime.current + 10.minutes)

      UserMailer.with(user:, otp:).otp.deliver_later
    end
end
