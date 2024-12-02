class ProfilePicturesController < ApplicationController
  before_action :get_user
  before_action :only_for_current_user

  def update
    profile_picture = ProfilePicture.new(profile_picture: params[:profile_picture])
    profile_picture.attach_to(@user)

    redirect_to my_profile_path, inertia: {errors: profile_picture.errors}
  end

  def destroy
    @user.profile_picture.purge_later

    redirect_to my_profile_path
  end

  private

  def get_user
    @user = User.find(params[:user_id])
  end
end
