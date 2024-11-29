class SessionsController < ApplicationController
  skip_before_action :require_authentication, only: %i[new create]
  before_action :only_for_guests, only: %i[new create]

  rate_limit to: 5,
    within: 1.minute,
    only: :create,
    by: -> { params[:email] },
    with: -> {
      redirect_to new_session_path,
        error: "Le maximum de tentatives a été atteint. Veuillez patienter."
    }

  def new
    render inertia: "Auth/SignIn"
  end

  def create
    user = User.find_by!(email: params[:email])
    otp = Otp.new(user:, code: params[:code])

    if otp.valid?
      user.update!(
        verified: true,
        otp_expires_at: DateTime.current # a used otp must be invalidated
      )
      sign_in(user)
      redirect_to my_profile_path, success: "Vous êtes connecté."
    else
      redirect_to new_session_path, inertia: {errors: otp.errors}
    end
  end

  def destroy
    session = Current.user.sessions.find(params[:id])
    session.destroy!
    redirect_to root_path, success: "Vous êtes déconnecté."
  end

  private

  def sign_in(user)
    session = user.sessions.create!
    cookies.signed.permanent[:session_token] = {value: session.id, httponly: true}
  end
end
