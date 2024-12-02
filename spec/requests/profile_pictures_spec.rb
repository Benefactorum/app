require "rails_helper"

RSpec.describe "ProfilePictures", type: :request, inertia: true do
  let(:user) { create(:user) }

  describe "PATCH /update" do
    subject { patch user_profile_picture_path(user), params: params }
    let(:params) { {} }

    it_behaves_like "only_for_current_user"

    context "when user is current_user" do
      before do
        sign_in_as(user)
      end

      context "without a profile_picture" do
        let(:params) { {profile_picture: nil} }
        it "does not update and returns an error" do
          subject
          expect(response).to redirect_to(my_profile_path)
          follow_redirect!
          expect(inertia.props[:errors]["profile_picture"]).to be_present
        end
      end
      context "with invalid file type" do
        let(:params) { {profile_picture: fixture_file_upload("invalid_file_type.svg")} }
        it "does not update and returns an error" do
          subject
          expect(response).to redirect_to(my_profile_path)
          follow_redirect!
          expect(inertia.props[:errors]["profile_picture"]).to be_present
        end
      end

      context "with file size exceeding limit" do
        let(:params) { {profile_picture: fixture_file_upload("valid_file.png")} }

        before do
          stub_const("User::ProfilePicture::MAX_PROFILE_PICTURE_SIZE", 0.megabytes)
        end
        it "does not update and returns an error" do
          subject
          expect(response).to redirect_to(my_profile_path)
          follow_redirect!
          expect(inertia.props[:errors]["profile_picture"]).to be_present
        end
      end

      context "with valid parameters" do
        let(:params) { {profile_picture: fixture_file_upload("valid_file.png")} }
        it "updates the profile picture and redirects" do
          subject
          expect(response).to redirect_to(my_profile_path)
          follow_redirect!
          expect(inertia.props[:errors]).to be_nil
        end
      end
    end
  end

  describe "DELETE /destroy" do
    subject { delete user_profile_picture_path(user) }

    it_behaves_like "only_for_current_user"

    context "when user is current_user" do
      before do
        sign_in_as(user)
      end

      context "with a profile picture" do
        before do
          user.profile_picture.attach(fixture_file_upload("valid_file.png"))
        end

        it "destroys the profile picture and redirects" do
          subject
          expect(user.reload.profile_picture).not_to be_attached
          expect(response).to redirect_to(my_profile_path)
        end
      end
    end
  end
end
