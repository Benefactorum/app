class SessionsController < ApplicationController
  skip_before_action :authenticate, only: %i[new create]

  before_action :set_session, only: :destroy

  rate_limit to: 5, within: 1.minute, only: :create, by: -> { params[:email] }


  def index
    @sessions = Current.user.sessions.order(created_at: :desc)
  end

  def new
    render inertia: "Auth/SignIn"
  end

  def create
    user = User.find_by(email: params[:email])
    unless user
      redirect_to new_connection_path
    end

    if params[:code].blank?
      redirect_to sign_in_path, inertia: { errors: { code: "champs obligatoire" } }
      return
    end

    hotp = ROTP::HOTP.new(user.otp_secret)

    if hotp.verify(params[:code], user.otp_counter)
      if DateTime.current > user.otp_expires_at
        redirect_to sign_in_path, inertia: { errors: { code: "Votre code de connexion a expiré. Demandez-en un nouveau." } }
      else
        user.update!(verified: true, otp_expires_at: DateTime.current)
        sign_in(user)
        redirect_to root_path, notice: "Vous êtes connecté."
      end
    else
      redirect_to sign_in_path, inertia: { errors: { code: "Code de connexion invalide." } }
    end
  end

  def destroy
    @session.destroy
    redirect_to sessions_path, notice: "That session has been logged out"
  end

  private

  def set_session
    @session = Current.user.sessions.find(params[:id])
  end

  def sign_in(user)
    session = user.sessions.create!
    cookies.signed.permanent[:session_token] = { value: session.id, httponly: true }
  end
end
