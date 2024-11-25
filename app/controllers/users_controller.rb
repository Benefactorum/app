class UsersController < ApplicationController
  skip_before_action :require_authentication

  before_action :get_user

  def show
    render inertia: "User/Show", props: {
      user: @user.as_json(only: %i[created_at first_name last_name])
    }
  end

  private

  def get_user
    @user = User.find(params[:id])
  end
end
