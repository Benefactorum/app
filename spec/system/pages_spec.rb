require "rails_helper"

RSpec.describe "Pages", type: :system do
  describe "/" do
    it "displays page" do
      visit root_path
      expect(page.text.squish).to include("Vous pouvez faire la différence, ici et maintenant")
    end
  end

  describe "/about_us" do
    it "displays page" do
      visit about_us_path
      expect(page.text.squish).to include("Vous prenez soin des autres ? On prend soin de vous !")
    end
  end

  describe "/cofounders" do
    it "displays page" do
      visit cofounders_path
      expect(page.text.squish).to include("Notre équipe")
    end
  end

  describe "/join_us" do
    it "displays page" do
      visit join_us_path
      expect(page.text.squish).to include("Nous rejoindre")
    end
  end
end
