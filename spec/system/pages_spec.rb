require "rails_helper"

RSpec.describe "Pages", type: :system do
  # before do
  #   driven_by(:rack_test)
  # end

  describe "GET /" do
    it "displays the home page" do
      visit root_path
      expect(page).to have_text("Vous pouvez faire\n la différence,\nici et maintenant\n")
    end
  end
end
