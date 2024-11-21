require 'rails_helper'

RSpec.describe "Registrations", type: :request, inertia: true do
  include ActiveSupport::Testing::TimeHelpers

  describe "GET /s-inscrire" do
    it "returns http success" do
      get new_registration_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /registrations" do
    context "with invalid params" do
      let!(:user) { create(:user) }

      context "when captcha is invalid" do
        before do
          allow_any_instance_of(Captcha).to receive(:valid?).and_return(false)
        end

        it "does not create a new user" do
          expect {
            post registrations_path, params: { email: user.email, last_name: "", accepts_conditions: false }
          }.not_to change(User, :count)
          expect(response).to redirect_to(new_registration_path)
          follow_redirect!
          expect(inertia.props[:flash]['error']).to eq("Erreur de validation du CAPTCHA. Veuillez réessayer.")
        end
      end

      context "when captcha is valid" do
        before do
          allow_any_instance_of(Captcha).to receive(:valid?).and_return(true)
        end

        it "does not create a new user" do
          expect {
            post registrations_path, params: { email: user.email, last_name: "", accepts_conditions: false }
          }.not_to change(User, :count)
          expect(response).to redirect_to(new_registration_path)
          follow_redirect!
          expect(inertia.props[:errors].keys).to include(:email, :first_name, :last_name, :terms_and_privacy_accepted_at)
        end

        it "does not create a new user" do
          expect {
            post registrations_path, params: { email: "new_user@mail.com", first_name: 'john', last_name: 'Doe', terms_and_privacy_accepted_at: 1.week.ago }
          }.not_to change(User, :count)
          expect(response).to redirect_to(new_registration_path)
          follow_redirect!
          expect(inertia.props[:errors].keys).to include(:terms_and_privacy_accepted_at)
        end
      end
    end

    context "with valid params" do
      before do
        allow_any_instance_of(Captcha).to receive(:valid?).and_return(true)
      end

      it "creates a new user, send otp email and redirects to /se-connecter" do
        freeze_time
        expect {
          post registrations_path, params: { email: "lazaronixon@hey.com", first_name: "Lazaro", last_name: "Nixon", accepts_conditions: true }
        }.to change(User, :count).by(1)

        user = User.find_by(email: "lazaronixon@hey.com")
        expect(user.first_name).to eq("Lazaro")
        expect(user.last_name).to eq("Nixon")
        expect(user.terms_and_privacy_accepted_at).to eq(Time.current)

        otp = user.reload.otp
        assert_enqueued_email_with UserMailer, :otp, params: { user:, otp: }

        expect(response).to redirect_to(new_session_path)
      end
    end
  end
end
