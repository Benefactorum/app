require "rails_helper"

RSpec.describe "InterventionAreas", type: :request, inertia: true do
  describe "GET /index" do
    subject { get intervention_areas_path, params: params }
    let(:params) { {} }

    it_behaves_like "require_authentication"

    context "when user is authenticated" do
      let(:user) { create(:user) }
      before { sign_in_as(user) }
      let(:params) { {query: "t"} }

      it "raises an error if query is less than 2 characters" do
        expect { subject }.to raise_error(RuntimeError)
      end

      context "when query is present" do
        let(:params) { {query: "test"} }

        it "returns first 3 keywords matching the query" do
          create_list(:intervention_area, 4)
          subject
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to eq([
            {"id" => 1, "name" => "Test1"},
            {"id" => 2, "name" => "Test2"},
            {"id" => 3, "name" => "Test3"}
          ])
        end

        it "returns an empty array if no keywords match the query" do
          create(:intervention_area, name: "not-matching")
          subject
          expect(JSON.parse(response.body)).to eq([])
        end
      end
    end
  end

  describe "POST /create" do
    subject { post intervention_areas_path, params: params }
    let(:params) { {} }

    it_behaves_like "require_authentication"

    context "when user is authenticated" do
      let(:user) { create(:user) }
      let(:params) { {name: "   teSt   "} }
      before { sign_in_as(user) }

      it "creates a new intervention area" do
        expect { subject }.to change(Osbl::InterventionArea, :count).by(1)
        expect(Osbl::InterventionArea.last.name).to eq("Test")
      end
    end
  end
end
