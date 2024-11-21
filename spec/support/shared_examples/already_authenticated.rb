RSpec.shared_examples "already_authenticated" do
  context "when the user is authenticated" do
    before do
      sign_in_as(create(:user))
    end

    it "redirects to root_path with an info message" do
      subject
      expect(response).to redirect_to(root_path)
      follow_redirect!
      expect(inertia.props[:flash]['info']).to be_present
    end
  end
end
