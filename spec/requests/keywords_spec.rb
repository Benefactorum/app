require "rails_helper"

RSpec.describe "Keywords", type: :request, inertia: true do
  describe "GET /index" do
    subject { get keywords_path, params: params }
    let(:params) { {} }

    it_behaves_like "require_authentication"

    context "when user is authenticated" do
      let(:user) { create(:user) }
      before { sign_in_as(user) }

      it "returns an empty array if query is empty" do
        subject
        expect(response).to have_http_status(:ok)
        expect(response.body).to eq("[]")
      end

      context "when query is present" do
        let(:params) { {query: "test"} }

        it "returns first 3 keywords matching the query" do
          create_list(:keyword, 4)
          subject
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to eq([
            [1, "test1"],
            [2, "test2"],
            [3, "test3"]
          ])
        end

        it "returns an empty array if no keywords match the query" do
          create(:keyword, name: "not-matching")
          subject
          expect(JSON.parse(response.body)).to eq([])
        end
      end
    end
  end

  describe "POST /create" do
    subject { post keywords_path, params: params }
    let(:params) { {} }

    it_behaves_like "require_authentication"

    context "when user is authenticated" do
      let(:user) { create(:user) }
      let(:params) { {name: "   teSt   "} }
      before { sign_in_as(user) }

      it "creates a new keyword" do
        expect { subject }.to change(Keyword, :count).by(1)
        expect(Keyword.last.name).to eq("Test")
      end

      # context "when keyword already exists" do
      #   before { create(:keyword, name: "test") }
      #   it "returns an error" do
      #     expect { subject }.to raise_error(ActiveRecord::RecordNotUnique)
      #   end
      # end
    end
  end
end
