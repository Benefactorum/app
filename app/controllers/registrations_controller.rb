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
      user.send_otp_email
      redirect_to sign_in_path
    else
      redirect_to new_registration_path, inertia: { errors: user.errors }
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
end
