require "rails_helper"

RSpec.describe "Pages", type: :system do
  # before do
  #   driven_by(:rack_test)
  # end

  describe "GET /" do
    it "displays the home page" do
      visit root_path
      expect(page.text.squish).to include("Vous pouvez faire la différence, ici et maintenant")
    end
  end
end
