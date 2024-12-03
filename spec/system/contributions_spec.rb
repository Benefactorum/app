require "rails_helper"

RSpec.describe "Contributions", type: :system do
  describe "GET /mes-contributions/ajouter-une-association" do
    before do
      connect_as(create(:user))
    end
    it "displays the home page" do
      visit my_new_contributions_path
      expect(page).to have_text("Ajouter une association")
    end
  end
end
