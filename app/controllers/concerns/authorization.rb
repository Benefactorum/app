# app/controllers/concerns/authorization.rb
module Authorization
  extend ActiveSupport::Concern

  included do
    before_action :require_authentication
  end

  private

  def require_authentication
    redirect_to new_connection_path, info: "Connectez-vous pour continuer." unless authenticated?
  end

  def only_for_guests
    redirect_to root_path, info: "Vous êtes déjà connecté." if authenticated?
  end

  def only_for_current_user
    redirect_to root_path, error: "Erreur d'autorisation" unless @user == Current.user
  end

  def require_admin
    head :forbidden unless Current.user.admin?
  end

  def require_current_user_or_admin(resource_user:)
    redirect_to root_path, error: "Vous n'avez pas les droits pour accéder à cette page" unless Current.user == resource_user || Current.user.admin?
  end
end
