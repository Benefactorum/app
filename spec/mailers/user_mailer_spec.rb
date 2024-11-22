require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
  describe "otp" do
    let(:user) { create(:user) }
    let(:mail) { UserMailer.with(user: user, otp: user.otp).otp }

    it "renders email" do
      expect(mail.subject).to eq("Benefactorum : Voici votre code de connexion")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["contact@benefactorum.org"])
      expect(mail.body.encoded).to include(user.otp)
    end
  end
end
