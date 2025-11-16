require "rails_helper"

RSpec.describe GithubEvents::CreateService do
  describe "#call" do
    subject { described_class.new(github_event:).call }
    context "when event is pull_request_review" do
      let(:github_event) { create(:github_event) }

      before do
        create(:contribution, status: "en attente de validation", github_resource_url: github_event.payload["pull_request"]["html_url"])
      end

      context "when changes are requested" do
        it "sets the related contribution model statuts to 'modifications demandées'" do
          subject
          expect(github_event.reload.contribution.status).to eq("modifications demandées")
          expect(github_event.status).to eq("processed")
        end
      end

      context "when the review is approved" do
        before do
          github_event.payload["review"]["state"] = "approved"
        end

        it "creates an OSBL and sets the related contribution model statuts to 'validée'" do
          expect { subject }.to change { Osbl.count }.by(1)
          expect(github_event.reload.contribution.status).to eq("validée")
          expect(github_event.status).to eq("processed")
        end
      end
    end
  end
end
