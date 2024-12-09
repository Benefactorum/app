class OtpsController < ApplicationController
  skip_before_action :require_authentication
  before_action :only_for_guests

  rate_limit to: 1,
    within: 1.minute,
    by: -> { params[:email] },
    only: :create,
    with: -> {
      redirect_to new_connection_path,
        error: "Veuillez patienter."
    }

  def create
    if (user = User.find_by(email: params[:email]))
      Otp.new(user:).send_email(expiration_check: false)
      redirect_to new_session_path
    else
      redirect_to new_connection_path
    end
  end
end
