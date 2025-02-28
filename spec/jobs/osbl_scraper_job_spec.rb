require "rails_helper"

RSpec.describe OsblScraperJob, type: :job do
  let(:job_id) { "e5be933c-4417-41f8-bfa3-3c834cd772f4" }
  let(:osbl_uri) { "https://universsel.org/" }

  describe "#perform" do
    it "creates an OsblImport and enqueues OsblCreationFromImportJob", :vcr do
      expect {
        described_class.perform_now(job_id, osbl_uri: osbl_uri)
      }.to change(OsblImport, :count).by(1)

      # Check that the OsblImport was created with correct attributes
      osbl_import = OsblImport.last
      expect(osbl_import.osbl_uri).to eq(osbl_uri)
      expect(osbl_import.extracted_data).to be_present

      # Check that OsblCreationFromImportJob was enqueued with the correct ID
      expect(OsblCreationFromImportJob).to have_been_enqueued.with(osbl_import.id)
    end

    it "does not enqueue itself again when completed" do
      VCR.use_cassette("OsblScraperJob/_perform/creates_an_OsblImport_and_enqueues_OsblCreationFromImportJob") do
        expect {
          described_class.perform_now(job_id, osbl_uri: osbl_uri)
        }.not_to have_enqueued_job(described_class)
      end
    end
  end

  context "when extraction is pending" do
    before do
      # Mock the Firecrawl service response for pending status
      firecrawl_instance = instance_double(Firecrawl)
      allow(Firecrawl).to receive(:new).and_return(firecrawl_instance)
      allow(firecrawl_instance).to receive(:get_extract_status).with(job_id).and_return({
        "status" => "pending"
      })
    end

    it "reschedules itself with increased interval" do
      expect {
        described_class.perform_now(job_id, osbl_uri: osbl_uri)
      }.to have_enqueued_job(described_class)
        .with(job_id, osbl_uri: osbl_uri, interval: 10.seconds)
        .on_queue("default")
    end
  end

  context "when extraction fails" do
    before do
      # Mock the Firecrawl service response for failed status
      firecrawl_instance = instance_double(Firecrawl)
      allow(Firecrawl).to receive(:new).and_return(firecrawl_instance)
      allow(firecrawl_instance).to receive(:get_extract_status).with(job_id).and_return({
        "status" => "failed"
      })
      allow(Rails.logger).to receive(:error)
    end

    it "logs an error" do
      described_class.perform_now(job_id, osbl_uri: osbl_uri)

      expect(Rails.logger).to have_received(:error).with(/OSBL scraping failed/)
    end
  end
end
