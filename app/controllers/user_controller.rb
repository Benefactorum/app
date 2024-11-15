class UserController < ApplicationController
  skip_before_action :authenticate, only: [ :create_or_find ]

  def create_or_find
    email = params[:email]

    if User.exists?(email:)
      # send passwordless email
      # redirect_to sign_in_path(email:)
    else
      # User.create(email:)
      redirect_to sign_up_path(email:)
    end
  end
end
