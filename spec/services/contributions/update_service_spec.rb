require "rails_helper"

RSpec.describe Contributions::UpdateService do
  let(:contribution) { create(:contribution) }
  describe "#call" do
    context "with valid params and already uploaded file" do
      let(:valid_params) do
        {
          body: "Updated body",
          files: [
            ActiveSupport::HashWithIndifferentAccess.new(
              filename: "sample.pdf",
              url: "https://example.com/sample.pdf"
            )
          ],
          osbl: {
            name: "Updated OSBL",
            tax_reduction: "intérêt_général",
            osbls_causes_attributes: [{cause_id: create(:cause).id}]
          }
        }
      end

      let(:file) { fixture_file_upload("sample.pdf", "application/pdf") }
      let!(:blob) {
        ActiveStorage::Blob.create_and_upload!(
          io: file.tempfile,
          filename: file.original_filename,
          content_type: file.content_type
        )
      }

      it "updates the contribution" do
        service = described_class.new(contribution: contribution, params: valid_params)
        status, message = service.call

        expect(status).to eq(:ok)
        expect(message).to eq("Votre contribution a été modifiée.")
        expect(contribution.reload.body).to eq("Updated body")
        expect(contribution.files.first.filename).to eq(file.original_filename)
      end
    end

    context "with valid params and new file" do
      let(:valid_params) do
        {
          body: "Updated body",
          files: [file],
          osbl: {
            name: "Updated OSBL",
            tax_reduction: "intérêt_général",
            osbls_causes_attributes: [{cause_id: create(:cause).id}]
          }
        }
      end

      let(:file) do
        tempfile = Tempfile.new(["test", ".png"])
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "valid_file.png",
          type: "image/png"
        )
      end

      it "updates the contribution" do
        service = described_class.new(contribution: contribution, params: valid_params)
        status, message = service.call

        expect(status).to eq(:ok)
        expect(message).to eq("Votre contribution a été modifiée.")
        expect(contribution.reload.body).to eq("Updated body")
        expect(contribution.files.first.filename).to eq(file.original_filename)
      end
    end

    context "with invalid osbl data" do
      let(:invalid_params) do
        {
          osbl: {
            tax_reduction: "intérêt_général",
            osbls_causes_attributes: [{cause_id: create(:cause).id}]
          }
        } # Invalid OSBL data
      end

      it "returns error status with validation errors" do
        service = described_class.new(contribution: contribution, params: invalid_params)
        status, errors = service.call

        expect(status).to eq(:error)
        expect(errors).to be_present
      end
    end
  end
end
