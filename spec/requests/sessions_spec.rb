require "rails_helper"

RSpec.describe "Sessions", type: :request, inertia: true do
  describe "GET /se-connecter" do
    subject { get new_session_path }

    it_behaves_like "only_for_guests"

    it "returns http success" do
      subject
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /sessions" do
    subject { post sessions_path, params: params }
    let(:params) { {} }

    it_behaves_like "only_for_guests"

    context "with invalid params" do
      context "when email is invalid" do
        let(:params) { {email: ""} }

        it "returns not found status" do
          subject
          expect(response).to have_http_status(:not_found)
        end
      end

      context "when code is invalid" do
        let!(:user) { create(:user, :with_otp) }
        let(:params) { {email: user.email, code: ""} }

        it "redirects back with errors" do
          subject
          expect(response).to redirect_to(new_session_path)
          follow_redirect!
          expect(inertia.props[:errors]["code"]).to be_present
        end
      end

      context "when code has been used" do
        let!(:user) { create(:user, :with_otp) }
        let(:params) { {email: user.email, code: user.otp.code} }

        before { user.otp.revoke! }

        it "redirects back with errors" do
          subject
          expect(response).to redirect_to(new_session_path)
          follow_redirect!
          expect(inertia.props[:errors]["code"]).to be_present
        end
      end

      context "when code is expired" do
        let!(:user) { create(:user, :with_otp) }
        let(:params) { {email: user.email, code: user.otp.code} }

        before { travel Otp::EXPIRATION_TIME + 1.second }

        it "redirects back with errors" do
          subject
          expect(response).to redirect_to(new_session_path)
          follow_redirect!
          expect(inertia.props[:errors]["code"]).to be_present
        end
      end
    end

    context "with valid params" do
      let(:user) { create(:user, :with_otp) }
      let(:params) { {email: user.email, code: user.otp.code} }

      it "signs in the user" do
        subject
        expect(response).to redirect_to my_profile_path
        follow_redirect!
        expect(inertia.props[:flash]["success"]).to be_present
      end
    end
  end

  describe "DELETE /sessions/:id" do
    let(:session) { create(:session) }
    subject { delete session_path(session) }

    it_behaves_like "require_authentication"

    context "when user is authenticated" do
      let(:user) { create(:user) }

      before do
        sign_in_as(user)
      end

      context "when the session does not belong to the current user" do
        it "returns not found status" do
          subject
          expect(response).to have_http_status(:not_found)
          # expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
          # error is swallowed by config.action_dispatch.rescue_responses: :rescuable
        end
      end

      context "when the session belongs to the current user" do
        let(:session) { user.sessions.first }

        it "destroys the session" do
          subject
          expect(response).to redirect_to(root_path)
          follow_redirect!
          expect(inertia.props[:flash]["success"]).to be_present
        end
      end
    end
  end
end
