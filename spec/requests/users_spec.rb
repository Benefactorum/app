require "rails_helper"

RSpec.describe "Users", type: :request, inertia: true do
  describe "GET /user/:id" do
    let(:user) { create(:user) }
    subject { get user_path(user) }

    it "returns http success" do
      subject
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /my_profile" do
    subject { get my_profile_path }

    it_behaves_like "require_authentication"

    context "when authenticated" do
      before do
        sign_in_as(create(:user))
      end

      it "returns http success" do
        subject
        expect(response).to have_http_status(:success)
      end
    end
  end

  xdescribe "PATCH /user/:id" do
    let(:user) { create(:user) }
    let(:valid_params) { {first_name: "John"} }
    subject { patch user_path(user), params: valid_params }

    it "redirects to /se-connecter" do
      subject
      expect(response).to redirect_to(new_connection_path)
    end

    context "when authenticated" do
      before do
        sign_in_as(user)
      end

      it "updates the user" do
        subject
        expect(user.reload.first_name).to eq("John")
      end
    end
  end
end
