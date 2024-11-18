class RegistrationsController < ApplicationController
  skip_before_action :authenticate

  before_action :add_terms_and_privacy_accepted_at, only: [ :create ]

  def new
    render inertia: "Auth/SignUp"
  end

  def create
    @user = User.new(user_params)

    if @user.save
      # session_record = @user.sessions.create!
      # cookies.signed.permanent[:session_token] = { value: session_record.id, httponly: true }

      # send_email_verification
      send_passwordless_email
      redirect_to sign_in_path # I need to pass a param to show the correct wording
      # redirect_to root_path, notice: "Welcome! You have signed up successfully"
    else
      redirect_to sign_up_path, inertia: { errors: @user.errors }
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

    # def send_email_verification
    #   UserMailer.with(user: @user).email_verification.deliver_later
    # end

    def send_passwordless_email
      UserMailer.with(user: @user).passwordless.deliver_later
    end
end
