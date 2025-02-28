RSpec.shared_examples "require_admin" do
  context "when the user is authenticated but not an admin" do
    before do
      sign_in_as(create(:user, admin: false))
    end

    it "returns a 403 forbidden status" do
      subject
      expect(response).to have_http_status(:forbidden)
    end
  end
end
