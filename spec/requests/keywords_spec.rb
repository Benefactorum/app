require "rails_helper"

RSpec.describe "Keywords", type: :request, inertia: true do
  describe "GET /index" do
    subject { get keywords_path, params: params }
    let(:params) { {} }

    it_behaves_like "require_authentication"

    context "when user is authenticated" do
      let(:user) { create(:user) }
      before { sign_in_as(user) }
      let(:params) { {query: "te"} }

      it "raises an error if query is less than 3 characters" do
        expect { subject }.to raise_error(RuntimeError)
      end

      context "when query is present" do
        let(:params) { {query: "tes"} }

        it "returns first 3 keywords matching the query" do
          4.times { |i| create(:keyword, name: "Test#{i + 1}") }
          subject
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to eq([
            {"id" => 1, "name" => "Test1"},
            {"id" => 2, "name" => "Test2"},
            {"id" => 3, "name" => "Test3"}
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
        expect { subject }.to change(Osbl::Keyword, :count).by(1)
        expect(Osbl::Keyword.last.name).to eq("Test")
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
