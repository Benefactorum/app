require "rails_helper"

RSpec.describe OsblImportJob, type: :job do
  let(:osbl_import) do
    create(:osbl_import,
      firecrawl_job_id: "e5be933c-4417-41f8-bfa3-3c834cd772f4",
      osbl_uri: "https://universsel.org/")
  end

  describe "#perform" do
    context "when extraction is completed" do
      it "processes the data and enqueues OsblCreationFromImportJob", :vcr do
        VCR.use_cassette("firecrawl/firecrawl_get_extract_status") do
          expect {
            described_class.perform_now(osbl_import_id: osbl_import.id)
          }.to change { osbl_import.reload.status }.to("extracted")
            .and have_enqueued_job(OsblCreationFromImportJob).with(osbl_import.id)

          expect(osbl_import.extracted_data).to be_present
        end
      end
    end

    context "when extraction is not completed" do
      let(:firecrawl_client) { instance_double(FirecrawlApi) }

      before do
        allow(FirecrawlApi).to receive(:new).and_return(firecrawl_client)
        allow(firecrawl_client).to receive(:get_extract_status)
          .with(osbl_import.firecrawl_job_id)
          .and_return(firecrawl_response)
      end

      context "when status is processing" do
        let(:firecrawl_response) { {"status" => "processing"} }

        it "reschedules itself with 5 seconds interval" do
          expect {
            described_class.perform_now(osbl_import_id: osbl_import.id)
          }.to have_enqueued_job(described_class)
            .with(osbl_import_id: osbl_import.id, interval: 5.seconds)
            .on_queue("default")
        end

        context "when total duration exceeds 3 minutes" do
          before do
            allow(Time).to receive(:current).and_return(Time.current + OsblImportJob::MAX_DURATION + 1.second)
          end

          it "marks the job as timed out" do
            expect {
              described_class.perform_now(osbl_import_id: osbl_import.id)
            }.to change { osbl_import.reload.status }.to("timed_out")
          end

          it "does not reschedule itself" do
            expect {
              described_class.perform_now(osbl_import_id: osbl_import.id)
            }.not_to have_enqueued_job(described_class)
          end
        end
      end

      context "when status is failed" do
        let(:firecrawl_response) { {"status" => "failed"} }

        it "updates the status to failed" do
          expect {
            described_class.perform_now(osbl_import_id: osbl_import.id)
          }.to change { osbl_import.reload.status }.to("failed")
        end
      end

      context "when status is cancelled" do
        let(:firecrawl_response) { {"status" => "cancelled"} }

        it "updates the status to cancelled" do
          expect {
            described_class.perform_now(osbl_import_id: osbl_import.id)
          }.to change { osbl_import.reload.status }.to("cancelled")
        end
      end
    end
  end
end
