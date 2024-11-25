require "rails_helper"

RSpec.describe "Users", type: :request do
  describe "GET /user/:id" do
    let(:user) { create(:user) }

    it "returns http success" do
      get user_path(user)
      expect(response).to have_http_status(:success)
    end
  end
end
