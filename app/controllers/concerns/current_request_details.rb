# app/controllers/concerns/current_request_details.rb
module CurrentRequestDetails
  extend ActiveSupport::Concern

  included do
    before_action :set_current_request_details
  end

  private

  def set_current_request_details
    Current.user_agent = request.user_agent
    Current.ip_address = request.ip
  end
end
