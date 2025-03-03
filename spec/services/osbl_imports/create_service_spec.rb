require "rails_helper"

RSpec.describe OsblImports::CreateService do
  describe "#call" do
    let(:osbl_uri) { "https://universsel.org" }
    let(:service) { described_class.new(osbl_uri: osbl_uri) }

    before do
      allow(Current).to receive(:user).and_return(create(:user))
    end

    context "when the URI is valid" do
      it "creates an OsblImport record" do
        VCR.use_cassette("firecrawl/firecrawl_extract") do
          expect { service.call }.to change(OsblImport, :count).by(1)
        end
      end

      it "sets the correct attributes on the OsblImport" do
        VCR.use_cassette("firecrawl/firecrawl_extract") do
          import_id = service.call
          import = OsblImport.find(import_id)

          expect(import.osbl_uri).to eq(osbl_uri)
          expect(import.user).to eq(Current.user)
          expect(import.firecrawl_job_id).to eq("e5be933c-4417-41f8-bfa3-3c834cd772f4")
        end
      end

      it "enqueues an OsblImportJob" do
        VCR.use_cassette("firecrawl/firecrawl_extract") do
          expect {
            service.call
          }.to have_enqueued_job(OsblImportJob).with(hash_including(:osbl_import_id))
        end
      end

      it "returns the osbl_import id" do
        VCR.use_cassette("firecrawl/firecrawl_extract") do
          import_id = service.call
          expect(import_id).to be_present
          expect(OsblImport.exists?(import_id)).to be true
        end
      end
    end

    context "when the URI is invalid" do
      let(:osbl_uri) { "not_a_url" }

      it "raises an error" do
        expect { service.call }.to raise_error("Invalid OSBL URI")
      end
    end

    context "when the Firecrawl API call fails" do
      let(:osbl_uri) { "https://invalid-domain" }

      it "raises an error" do
        VCR.use_cassette("firecrawl/firecrawl_extract_error") do
          expect { service.call }.to raise_error(/Failed to start extract job/)
        end
      end
    end

    context "when the URI has a trailing slash" do
      let(:osbl_uri) { "https://universsel.org/" }

      it "normalizes the URI by removing the trailing slash" do
        VCR.use_cassette("firecrawl/firecrawl_extract") do
          import_id = service.call
          import = OsblImport.find(import_id)
          expect(import.osbl_uri).to eq("https://universsel.org")
        end
      end
    end
  end
end
