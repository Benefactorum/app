class Sessions::PasswordlessesController < ApplicationController
  skip_before_action :authenticate

  before_action :set_user, only: :edit

  def new
  end

  def edit
    @user.update!(verified: true) # if not already verified
    session_record = @user.sessions.create!
    cookies.signed.permanent[:session_token] = { value: session_record.id, httponly: true }

    redirect_to(root_path, success: "Signed in successfully")
  end

  def create
    if @user = User.find_by(email: params[:email], verified: true)
      send_passwordless_email
      redirect_to sign_in_path, info: "Check your email for sign in instructions"
    else
      redirect_to new_sessions_passwordless_path, warning: "You can't sign in until you verify your email"
    end
  end

  private
    def set_user
      @user = User.find_by_token_for!(:passwordless, params[:sid])
    rescue StandardError
      redirect_to sign_in_path, error: "That email passwordless link is invalid"
      # redirect_to new_sessions_passwordless_path, warning: "That sign in link is invalid"
    end

    def send_passwordless_email
      UserMailer.with(user: @user).passwordless.deliver_later
    end
end
