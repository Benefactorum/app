require "rails_helper"

RSpec.describe "ProfilePictures", type: :request do
  describe "GET /update" do
    it "returns http success" do
      get "/profile_picture/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/profile_picture/destroy"
      expect(response).to have_http_status(:success)
    end
  end
end
