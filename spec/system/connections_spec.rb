require "rails_helper"

RSpec.describe "/connection", type: :system do
  it "displays page" do
    visit new_connection_path
    expect(page.text.squish).to include("Connectez-vous ou inscrivez-vous en quelques secondes !")
  end
end
