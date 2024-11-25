class ProfilePicturesController < ApplicationController
  before_action :get_user
  before_action :only_for_current_user, only: %i[update]

  def update
    # I need to validate file type and size
    @user.update!(user_params)

    redirect_to @user
  end

  def destroy
    @user.profile_picture.purge_later

    redirect_to @user
  end

  private

  def user_params
    params.permit(:profile_picture)
  end

  def get_user
    @user = User.find(params[:user_id])
  end
end
