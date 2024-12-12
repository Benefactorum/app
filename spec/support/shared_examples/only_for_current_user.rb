RSpec.shared_examples "only_for_current_user" do
  context "when the target user is not the current user" do
    before do
      sign_in_as(create(:user, email: "current_user@mail.com", otp: create(:otp)))
    end

    it "redirects to root_path with an info message" do
      subject
      expect(response).to redirect_to(root_path)
      follow_redirect!
      expect(inertia.props[:flash]["error"]).to be_present
    end
  end
end
