class ConnectionsController < ApplicationController
  skip_before_action :require_authentication
  before_action :only_for_guests

  rate_limit to: 5,
    within: 1.minute,
    only: :create,
    by: -> { params[:email] },
    with: -> {
      redirect_to new_connection_path,
        error: "Le maximum de connexions a été atteint. Veuillez patienter."
    }
  rate_limit to: 1,
    within: 1.minute,
    only: :resend_otp,
    with: -> {
      redirect_to new_connection_path,
        error: "Veuillez patienter."
    }

  def new
    render inertia: "Auth/Connection"
  end

  def create
    email = params[:email]
    if (user = User.find_by(email:))
      Otp.new(user:).send_email
      redirect_to new_session_path
    else
      user = User.create(email:) # will always fail because missing mandatory fields
      if user.errors[:email].any?
        redirect_to new_connection_path, inertia: {errors: user.errors}
      else
        redirect_to new_registration_path
      end
    end
  end

  def resend_otp
    if (user = User.find_by(email: params[:email]))
      Otp.new(user:).send_email(expiration_check: false)
      redirect_to new_session_path
    else
      redirect_to new_connection_path
    end
  end
end
