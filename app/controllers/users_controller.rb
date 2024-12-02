class UsersController < ApplicationController
  skip_before_action :require_authentication, only: %i[show]

  before_action :get_user_or_current, only: %i[show]
  before_action :only_for_current_user, only: %i[update]

  def show
    render inertia: "User/Show", props: {
      user: @user.as_json(only: %i[id created_at first_name last_name]),
      profile_picture_url: @user.profile_picture.attached? ? url_for(@user.profile_picture) : nil
    }
  end

  def update
    @user.update!(user_params)

    redirect_to my_profile_path
  end

  private

  def user_params
    params.permit(:profile_picture)
  end

  def get_user
    @user = User.find(params[:id])
  end
end
