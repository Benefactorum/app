require "rails_helper"

RSpec.describe "Otp", type: :request, inertia: true do
  describe "POST /otp" do
    subject { post otp_path, params: params }
    let(:params) { {} }

    it_behaves_like "only_for_guests"

    context "when user is not found" do
      let(:params) { {email: "unknown@mail.com"} }

      it "redirects to /connection and does not send email" do
        assert_no_emails do
          subject
        end
        expect(response).to redirect_to(new_connection_path)
      end
    end

    context "when user is known" do
      let(:user) { create(:user) }
      let(:params) { {email: user.email} }

      it "sends OTP email and redirects to /se-connecter" do
        assert_enqueued_emails 1 do
          subject
        end
        expect(response).to redirect_to(new_session_path)
      end

      it "sends OTP email again even if OTP is still valid and redirects to /se-connecter" do
        otp = user.generate_new_otp!
        assert_enqueued_emails 1 do
          subject
        end
        expect(user.reload.otp).not_to eq(otp)
        expect(response).to redirect_to(new_session_path)
      end
    end
  end
end
