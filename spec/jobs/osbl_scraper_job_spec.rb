require "rails_helper"

RSpec.describe OsblScraperJob, type: :job do
  let(:job_id) { "e5be933c-4417-41f8-bfa3-3c834cd772f4" }
  let(:osbl_uri) { "https://universsel.org/" }

  describe "#perform" do
    it "works", :vcr do
      expect {
        described_class.perform_now(job_id, osbl_uri: osbl_uri)
      }.not_to have_enqueued_job(described_class)
    end
  end
end
