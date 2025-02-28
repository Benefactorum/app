require "rails_helper"

RSpec.describe OsblScraperJob, type: :job do
  let(:job_id) { "9c74fe32-0a4e-4a78-a72e-ab2ee02804b1" }
  let(:osbl_uri) { "https://universsel.org/" }

  describe "#perform" do
    it "works", :vcr do
      expect {
        described_class.perform_now(job_id, osbl_uri: osbl_uri)
      }.not_to have_enqueued_job(described_class)
    end
  end
end
