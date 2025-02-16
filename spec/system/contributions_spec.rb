require "rails_helper"

RSpec.describe "Contributions", type: :system do
  describe "/mes-contributions" do
    before do
      connect_as(create(:user, :with_otp))
    end
    it "displays page" do
      visit my_contributions_path
      expect(page).to have_text("Mon historique")
    end
  end

  describe "/mes-contributions/ajouter-une-association" do
    before do
      connect_as(create(:user, :with_otp))
    end
    it "displays page" do
      visit my_new_contribution_path
      expect(page).to have_text("Ajouter une association")
    end
  end

  describe "/mes-contributions/:id/modifier" do
    let(:user) { create(:user, :with_otp) }
    let!(:contribution) { create(:contribution, :osbl_creation, user: user) }

    before do
      connect_as(user)
    end

    it "displays edit page" do
      visit edit_my_contribution_path(contribution)
      expect(page).to have_text("Modifier une association")
    end
  end
end
