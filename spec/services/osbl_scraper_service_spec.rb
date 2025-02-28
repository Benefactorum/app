require "rails_helper"

RSpec.describe OsblScraperService do
  describe "#call", :vcr do
    let(:osbl_uri) { "https://universsel.org/" }
    let(:service) { described_class.new(osbl_uri) }

    context "when the API call is successful" do
      it "starts an extract job and schedules a background job" do
        # Ensure the job is enqueued
        expect {
          service.call
        }.to have_enqueued_job(OsblScraperJob)
      end
    end
  end
end
