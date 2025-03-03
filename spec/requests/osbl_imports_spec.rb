require "rails_helper"

RSpec.describe "/osbl_imports", type: :request, inertia: true do
  describe "POST /create" do
    let(:valid_params) { {osbl_uri: "https://example.org/osbl"} }
    subject { post osbl_imports_url, params: valid_params }

    it_behaves_like "require_authentication"
    it_behaves_like "require_admin"

    context "when user is authenticated and admin" do
      let(:admin_user) { create(:user, admin: true) }
      let(:osbl_import) { build(:osbl_import, id: 123) }

      before do
        sign_in_as(admin_user)
        allow(OsblImports::CreateService).to receive(:new)
          .with(osbl_uri: valid_params[:osbl_uri])
          .and_return(instance_double(OsblImports::CreateService, call: osbl_import))
      end

      it "returns a successful response" do
        subject
        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response).to include("id" => osbl_import.id)
      end
    end
  end

  describe "GET /show" do
    let(:osbl_import) { create(:osbl_import) }
    subject { get osbl_import_url(osbl_import) }

    it_behaves_like "require_authentication"
    it_behaves_like "require_admin"

    context "when user is authenticated and admin" do
      let(:admin_user) { create(:user, admin: true) }

      before do
        sign_in_as(admin_user)
      end

      it "returns a successful response" do
        subject
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response).to include(
          "id" => osbl_import.id,
          "status" => osbl_import.status,
          "contribution_id" => nil
        )
      end

      context "when osbl_import has a contribution" do
        let(:contribution) { create(:contribution) }
        let(:osbl_import) { create(:osbl_import, contribution: contribution) }

        it "includes the contribution_id" do
          subject
          json_response = JSON.parse(response.body)
          expect(json_response).to include("contribution_id" => contribution.id)
        end
      end

      context "when osbl_import does not exist" do
        subject { get osbl_import_url(0) }

        it "returns not found" do
          subject
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end
end
