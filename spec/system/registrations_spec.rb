require "rails_helper"

RSpec.describe "Registrations", type: :system do
  before do
    # avoid redirection when hitting new_registration_path
    # as it sets up email in the local storage
    visit new_connection_path
    fill_in "Votre adresse email", with: "placeholder@email.com"
    click_button "Continuer"
  end

  describe "#new" do
    it "displays page" do
      # visit new_registration_path
      expect(page).to have_content("Créez votre compte !")
    end
  end
end
