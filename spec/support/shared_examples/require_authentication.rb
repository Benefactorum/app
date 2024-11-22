RSpec.shared_examples "require_authentication" do
  context "when the user is a guest" do
    it "redirects to new_connection_path with an info message" do
      subject
      expect(response).to redirect_to(new_connection_path)
      follow_redirect!
      expect(inertia.props[:flash]["info"]).to be_present
    end
  end
end
