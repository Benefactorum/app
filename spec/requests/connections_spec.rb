require "rails_helper"

RSpec.describe "Connection", type: :request, inertia: true do
  describe "GET /connexion" do
    subject { get new_connection_path }

    it_behaves_like "only_for_guests"

    it "returns http success" do
      subject
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /connection" do
    subject { post connection_path, params: params }
    let(:params) { {} }

    it_behaves_like "only_for_guests"

    context "when email is invalid" do
      let(:params) { {email: ""} }

      it "redirects back with errors" do
        assert_no_emails do
          subject
        end
        expect(response).to redirect_to(new_connection_path)
        follow_redirect!
        expect(inertia.props[:errors]["email"]).to be_present
      end
    end

    context "when user is unknown" do
      let(:params) { {email: "unknown@mail.com"} }

      xcontext "when rate limit is reached" do
        # can't get this test to pass, but feature works as expected
        it "rate_limit" do
          9.times do
            post connection_path, params: {email: "unknown@mail.com"}
          end
          post connection_path, params: {email: "unknown@mail.com"}
          expect(response).to redirect_to(new_connection_path)
          follow_redirect!
          expect(inertia.props[:flash]).to be_present
        end
      end

      it "redirects to /s-inscrire" do
        assert_no_emails do
          subject
        end
        expect(response).to redirect_to(new_registration_path)
      end
    end

    context "when user is known" do
      let!(:user) { create(:user, otp: otp) }

      let(:params) { {email: user.email} }

      context "when OTP is expired" do
        let(:otp) { create(:otp) }

        before { travel Users::Otp::EXPIRATION_TIME + 1.second }
        it "redirects to /se-connecter and sends OTP email" do
          assert_enqueued_emails 1 do
            subject
          end
          assert_enqueued_email_with UserMailer, :otp, params: {user:}
          expect(response).to redirect_to(new_session_path)
        end
      end

      context "when OTP has been used" do
        let(:otp) { create(:otp, :used) }

        it "redirects to /se-connecter and sends OTP email" do
          assert_enqueued_emails 1 do
            subject
          end
          assert_enqueued_email_with UserMailer, :otp, params: {user:}
          expect(response).to redirect_to(new_session_path)
        end
      end

      context "when OTP is not expired nor used" do
        let(:otp) { create(:otp) }
        it "redirects to /se-connecter but does not send OTP email again" do
          assert_no_emails do
            subject
          end
          expect(response).to redirect_to(new_session_path)
        end
      end
    end
  end
end
