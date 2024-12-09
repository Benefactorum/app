module Auth
  class ConnectionsController < ApplicationController
    skip_before_action :require_authentication
    before_action :only_for_guests

    rate_limit to: 5,
      within: 1.minute,
      only: :create,
      by: -> { params[:email] },
      with: -> {
        redirect_to new_connection_path,
          error: "Le maximum de connexions a été atteint. Veuillez patienter."
      }

    def new
      render inertia: "Auth/Connection"
    end

    def create
      form = NewConnectionForm.new(email: params[:email])

      case form.submit
      when :existing_user
        redirect_to new_session_path
      when :new_user
        redirect_to new_registration_path
      else
        redirect_to new_connection_path, inertia: {errors: form.errors}
      end
    end
  end
end
