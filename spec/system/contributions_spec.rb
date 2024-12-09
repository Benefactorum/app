require "rails_helper"

RSpec.describe "Contributions", type: :system do
  describe "/mes-contributions" do
    before do
      connect_as(create(:user))
    end
    it "displays page" do
      visit my_new_contribution_path
      expect(page).to have_text("Ajouter une association")
    end
  end
end
