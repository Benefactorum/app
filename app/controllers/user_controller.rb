class UserController < ApplicationController
  skip_before_action :authenticate, only: [ :connection, :create_or_find ]

  def connection
    render inertia: "Auth/Connection"
  end

  def create_or_find
    email = params[:email]
    if @user = User.find_by(email:)
    else
      @user = User.create(email:) # will always fail because missing mandatory fields
      if @user.errors[:email].any?
        redirect_to connection_path, inertia: { errors: @user.errors }
      else
        redirect_to sign_up_path
      end
    end
  end
end
