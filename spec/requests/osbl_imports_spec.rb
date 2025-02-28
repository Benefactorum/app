require "rails_helper"

RSpec.describe "/osbl_imports", type: :request, inertia: true do
  describe "POST /create" do
    let(:valid_params) { {osbl_uri: "https://example.org/osbl"} }
    subject { post osbl_imports_url, params: valid_params }

    it_behaves_like "require_authentication"
    it_behaves_like "require_admin"

    context "when user is authenticated and admin" do
      let(:admin_user) { create(:user, admin: true) }

      before do
        sign_in_as(admin_user)
        allow_any_instance_of(OsblScraperService).to receive(:call).and_return(123)
      end

      it "returns a successful response" do
        subject
        expect(response).to have_http_status(:created)
      end

      it "returns the osbl_import_id" do
        subject
        json_response = JSON.parse(response.body)
        expect(json_response).to include("osbl_import_id" => 123)
      end
    end
  end
end
