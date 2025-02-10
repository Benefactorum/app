# app/controllers/concerns/authentication.rb
module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate
  end

  private

  def authenticate
    if (session_record = Users::Session.find_by_id(cookies.signed[:session_token]))
      Current.session = session_record
    end
  end

  def authenticated?
    Current.user.present?
  end
end
