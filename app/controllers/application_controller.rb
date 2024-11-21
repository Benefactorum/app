class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  inertia_share flash: -> { flash.to_hash }
  inertia_share user: -> { Current.user }
  inertia_share sessionId: -> { Current.session&.id }

  add_flash_types :message, :success, :info, :warning, :error

  before_action :set_current_request_details
  before_action :authenticate
  before_action :require_authentication

  private

  def set_current_request_details
    Current.user_agent = request.user_agent
    Current.ip_address = request.ip
  end

  def authenticate
    if session_record = Session.find_by_id(cookies.signed[:session_token])
      Current.session = session_record
    end
  end

  def require_authentication
    redirect_to new_connection_path, info: "Connectez-vous pour continuer." unless authenticated?
  end

  def only_for_guests
    redirect_to root_path, info: "Vous êtes déjà connecté." if authenticated?
  end

  def authenticated?
    Current.user.present?
  end
end
