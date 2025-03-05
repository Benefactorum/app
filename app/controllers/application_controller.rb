class ApplicationController < ActionController::Base
  include CurrentRequestDetails
  include Authentication
  include Authorization

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: {chrome: 50, safari: 14, firefox: 65, edge: 18, ie: false} # if Rails.env.production?

  inertia_share flash: -> { flash.to_hash }
  inertia_share currentUser: -> { Current.user&.slice(:id, :first_name, :admin) }
  inertia_share sessionId: -> { Current.session&.id }

  add_flash_types :message, :success, :info, :warning, :error

  private

  def get_current_user
    require_authentication
    @user = Current.user
  end

  def get_user_or_current
    @user = get_user
  rescue ActiveRecord::RecordNotFound
    get_current_user
  end
end
