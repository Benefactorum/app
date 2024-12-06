require "rails_helper"

RSpec.describe "Sessions", type: :system do
  let(:user) { create(:user) }

  before do
    # avoid redirection when hitting new_session_path
    # as it sets up email in the local Storage
    visit new_connection_path
    fill_in "email", with: user.email
    click_button "Continuer"
  end

  describe "#new" do
    it "displays page" do
      # visit new_session_path
      expect(page).to have_content("Une fois que vous aurez saisi le code que nous avons envoyé")
    end
  end
end
