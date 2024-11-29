class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern
  allow_browser versions: {chrome: 50, safari: 14, firefox: 65, edge: 18, ie: false} # if Rails.env.production?

  inertia_share flash: -> { flash.to_hash }
  inertia_share currentUser: -> { Current.user&.slice(:id, :first_name) }
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
    if (session_record = Session.find_by_id(cookies.signed[:session_token]))
      Current.session = session_record
    end
  end

  def require_authentication
    redirect_to new_connection_path, info: "Connectez-vous pour continuer." unless authenticated?
  end

  def only_for_guests
    redirect_to root_path, info: "Vous êtes déjà connecté." if authenticated?
  end

  def only_for_current_user
    redirect_to root_path, error: "Erreur d'autorisation" unless @user == Current.user
  end

  def authenticated?
    Current.user.present?
  end

  def get_user_or_current
    @user = get_user
  rescue ActiveRecord::RecordNotFound
    @user = Current.user
    require_authentication
  end
end
