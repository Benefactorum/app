require 'rails_helper'

RSpec.describe "Sessions", type: :request, inertia: true do
  describe "GET /se-connecter" do
    subject { get new_session_path }

    it_behaves_like "already_authenticated"

    it "returns http success" do
      subject
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /sessions" do
    subject { post sessions_path, params: params }
    let(:params) { {} }

    it_behaves_like "already_authenticated"

    context "with invalid params" do
      context "when email is invalid" do
        let(:params) { { email: "" } }

        it "redirects back to /connection" do
          subject
          expect(response).to redirect_to(new_session_path)
          follow_redirect!
          expect(inertia.props[:errors][:user]).to be_present
        end
      end

      context "when code is invalid" do
        let!(:user) { create(:user) }
        let(:params) { { email: user.email, code: "" } }

        it "redirects back with errors" do
          subject
          expect(response).to redirect_to(new_session_path)
          follow_redirect!
          expect(inertia.props[:errors][:code]).to be_present
        end
      end
    end

    context "with valid params" do
      let(:user) { create(:user) }
      let(:params) { { email: user.email, code: user.otp } }

      it "signs in the user" do
        subject
        expect(response).to redirect_to(root_path)
        follow_redirect!
        expect(inertia.props[:flash]['success']).to be_present
      end
    end
  end
end
