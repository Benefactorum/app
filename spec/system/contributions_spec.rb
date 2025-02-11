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
end
