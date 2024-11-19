class ConnectionsController < ApplicationController
  skip_before_action :authenticate

  rate_limit to: 5, within: 1.minute, only: :create, by: -> { params[:email] }
  rate_limit to: 1, within: 1.minute, only: :resend_otp

  def new
    render inertia: "Auth/Connection"
  end

  def create
    email = params[:email]
    if user = User.find_by(email:)
      send_otp_email(user)
      redirect_to sign_in_path
    else
      user = User.create(email:) # will always fail because missing mandatory fields
      if user.errors[:email].any?
        redirect_to new_connection_path, inertia: { errors: user.errors }
      else
        redirect_to sign_up_path
      end
    end
  end

  def resend_otp
    if user = User.find_by(email: params[:email])
      send_otp_email(user)
      redirect_to sign_in_path
    else
      redirect_to new_connection_path
    end
  end

  private

  def send_otp_email(user)
    user.increment!(:otp_counter)
    user.update!(otp_expires_at: DateTime.current + 10.minutes)

    otp = ROTP::HOTP.new(user.otp_secret).at(user.otp_counter)

    UserMailer.with(user: user, otp: otp).otp.deliver_later
  end
end
