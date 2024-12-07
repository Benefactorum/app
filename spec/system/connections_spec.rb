require "rails_helper"

RSpec.describe "Connections", type: :system do
  describe "#new" do
    it "displays page" do
      visit new_connection_path
      expect(page.text.squish).to include("Connectez-vous ou inscrivez-vous en quelques secondes !")
    end
  end
end
