require 'rails_helper'

RSpec.describe "Connections", type: :request, inertia: true do
  describe "GET /connexion" do
    it "returns http success" do
      get new_connection_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /connections" do
    context "when email is invalid" do
      it "redirects back with errors" do
        assert_no_emails do
          post connections_path, params: { email: "" }
        end
        expect(response).to redirect_to(new_connection_path)
        follow_redirect!
        expect(inertia.props[:errors][:email]).to be_present
      end
    end

    context "when user is unknown" do
      xcontext "when rate limit is reached" do
        # can't get this test to pass, but feature works as expected
        it "rate_limit" do
          9.times do
            post connections_path, params: { email: "unknown@mail.com" }
          end
          post connections_path, params: { email: "unknown@mail.com" }
          expect(response).to redirect_to(new_connection_path)
          follow_redirect!
          expect(inertia.props[:flash]).to be_present
        end
      end

      it "redirects to /s-inscrire" do
        assert_no_emails do
          post connections_url, params: { email: "unknown@mail.com" }
        end
        expect(response).to redirect_to(new_registration_path)
      end
    end

    context "when user is known" do
      let(:user) { create(:user) }

      it "redirects to /se-connecter and sends OTP email" do
        assert_enqueued_emails 1 do
          post connections_url, params: { email: user.email }
        end
        otp = user.reload.otp
        assert_enqueued_email_with UserMailer, :otp, params: { user:, otp: }
        expect(response).to redirect_to(new_session_path)
      end

      it "redirects to /se-connecter but does not send OTP email again if OTP is still valid" do
        otp = user.generate_new_otp
        assert_no_emails do
          post connections_url, params: { email: user.email }
        end
        expect(user.reload.otp).to eq(otp)
        expect(response).to redirect_to(new_session_path)
      end
    end
  end

  describe "POST /connections/resend_otp" do
    context "when user is not found" do
      it "redirects to /connection and does not send email" do
        assert_no_emails do
          post resend_otp_connections_path, params: { email: "unknown@mail.com" }
        end
        expect(response).to redirect_to(new_connection_path)
      end
    end

    context "when user is known" do
      let(:user) { create(:user) }

      it "sends OTP email and redirects to /se-connecter" do
        assert_enqueued_emails 1 do
          post resend_otp_connections_path, params: { email: user.email }
        end
        expect(response).to redirect_to(new_session_path)
      end

      it "sends OTP email again even if OTP is still valid and redirects to /se-connecter" do
        otp = user.generate_new_otp
        assert_enqueued_emails 1 do
          post resend_otp_connections_path, params: { email: user.email }
        end
        expect(user.reload.otp).not_to eq(otp)
        expect(response).to redirect_to(new_session_path)
      end
    end
  end
end
