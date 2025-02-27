require "rails_helper"

RSpec.describe Contributions::UpdateService do
  let(:contribution) { create(:contribution) }
  describe "#call" do
    context "with valid params and already uploaded file" do
      let(:valid_params) do
        {
          "body" => "Updated body",
          "files" => [
            {
              "filename" => "sample.pdf",
              "url" => "https://example.com/sample.pdf"
            }
          ],
          "osbl" => {
            "name" => "Updated OSBL",
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => create(:cause).id}]
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
        status, resource = service.call

        expect(status).to eq(:ok)
        expect(resource).to eq(contribution)
        expect(contribution.reload.body).to eq("Updated body")
        expect(contribution.files.first.filename).to eq(file.original_filename)
      end
    end

    context "with valid params and new file" do
      let(:valid_params) do
        {
          "body" => "Updated body",
          "files" => [file],
          "osbl" => {
            "name" => "Updated OSBL",
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => create(:cause).id}]
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
        status, resource = service.call

        expect(status).to eq(:ok)
        expect(resource).to eq(contribution)
        expect(contribution.reload.body).to eq("Updated body")
        expect(contribution.files.first.filename).to eq(file.original_filename)
      end
    end

    context "when removing files from contribution" do
      let(:first_file) do
        tempfile = Tempfile.new(["first_file", ".pdf"])
        File.write(tempfile.path, "First file content")
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "first_file.pdf",
          type: "application/pdf"
        )
      end

      let(:second_file) do
        tempfile = Tempfile.new(["second_file", ".pdf"])
        File.write(tempfile.path, "Second file content")
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "second_file.pdf",
          type: "application/pdf"
        )
      end

      let(:third_file) do
        tempfile = Tempfile.new(["third_file", ".pdf"])
        File.write(tempfile.path, "Third file content")
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "third_file.pdf",
          type: "application/pdf"
        )
      end

      let(:initial_params) do
        {
          "body" => "Initial body",
          "files" => [first_file, second_file],
          "osbl" => {
            "name" => "Initial OSBL",
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => create(:cause).id}]
          }
        }
      end

      it "purges files that are no longer present in the updated params" do
        # Create a contribution with initial files
        user = create(:user)
        create_service = Contributions::CreateService.new(user: user, params: initial_params)
        _, contribution = create_service.call

        # Store the initial files for later verification
        first_file_blob = contribution.files.first.blob
        second_file_blob = contribution.files.last.blob
        expect(first_file_blob).to be_present
        expect(second_file_blob).to be_present

        # Update the update_params to use the correct file reference
        update_params = {
          "body" => "Updated body",
          "files" => [
            # Keep the second file
            {
              "filename" => second_file_blob.filename.to_s,
              "url" => FileProcessor.generate_url(second_file_blob)
            },
            # Add a new file
            third_file
          ],
          "osbl" => {
            "name" => "Updated OSBL",
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => create(:cause).id}]
          }
        }

        # Create the service
        update_service = Contributions::UpdateService.new(contribution: contribution, params: update_params)

        # Update the contribution and check job enqueueing for purging the first file
        update_status, updated_contribution = update_service.call

        # Verify the update was successful
        expect(update_status).to eq(:ok)

        # Verify only the second file remains
        expect(updated_contribution.reload.files.count).to eq(2)

        # Verify the first file blob has been purged
        perform_enqueued_jobs
        expect(ActiveStorage::Blob.exists?(first_file_blob.id)).to be false
        expect(ActiveStorage::Blob.exists?(second_file_blob.id)).to be true
      end
    end

    context "with invalid osbl data" do
      let(:invalid_params) do
        {
          "osbl" => {
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => create(:cause).id}]
          }
        }
      end

      it "returns error status with validation errors" do
        service = described_class.new(contribution: contribution, params: invalid_params)
        status, errors = service.call

        expect(status).to eq(:error)
        expect(errors).to be_present
      end
    end

    context "when replacing a logo in osbl_data" do
      let(:user) { create(:user) }
      let(:cause) { create(:cause) }

      let(:initial_logo) do
        tempfile = Tempfile.new(["initial_logo", ".png"])
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "initial_logo.png",
          type: "image/png"
        )
      end

      let(:new_logo) do
        tempfile = Tempfile.new(["new_logo", ".png"])
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "new_logo.png",
          type: "image/png"
        )
      end

      let(:initial_params) do
        {
          "body" => "Initial body",
          "osbl" => {
            "name" => "Initial OSBL",
            "logo" => initial_logo,
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => cause.id}]
          }
        }
      end

      let(:update_params) do
        {
          "body" => "Updated body",
          "osbl" => {
            "name" => "Updated OSBL",
            "logo" => new_logo,
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => cause.id}]
          }
        }
      end

      it "replaces the old logo with the new one and purges the old logo" do
        # Create a contribution with an initial logo
        create_service = Contributions::CreateService.new(user: user, params: initial_params)
        _, contribution = create_service.call

        # Store the initial logo's signed id for later verification
        initial_logo_signed_id = contribution.osbl_data["logo"]
        initial_logo_blob = ActiveStorage::Blob.find_signed(initial_logo_signed_id)
        expect(initial_logo_blob).to be_present

        # Create the service and capture the result before testing job enqueueing
        update_service = Contributions::UpdateService.new(contribution: contribution, params: update_params)

        # Update the contribution with a new logo and check job enqueueing
        expect {
          @update_status, @updated_contribution = update_service.call
        }.to have_enqueued_job.exactly(1).times

        # Verify the update was successful
        expect(@update_status).to eq(:ok)

        # Verify the new logo is in the osbl_data and is different
        updated_logo_signed_id = @updated_contribution.osbl_data["logo"]
        expect(updated_logo_signed_id).to be_present
        expect(updated_logo_signed_id).not_to eq(initial_logo_signed_id)

        # Verify the old logo blob has been purged
        perform_enqueued_jobs
        expect(ActiveStorage::Blob.exists?(initial_logo_blob.id)).to be false
      end
    end

    context "when removing a logo from osbl_data" do
      let(:user) { create(:user) }
      let(:cause) { create(:cause) }

      let(:initial_logo) do
        tempfile = Tempfile.new(["initial_logo", ".png"])
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "initial_logo.png",
          type: "image/png"
        )
      end

      let(:initial_params) do
        {
          "body" => "Initial body",
          "osbl" => {
            "name" => "Initial OSBL",
            "logo" => initial_logo,
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => cause.id}]
          }
        }
      end

      let(:update_params_without_logo) do
        {
          "body" => "Updated body",
          "osbl" => {
            "name" => "Updated OSBL",
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => cause.id}]
            # No logo field
          }
        }
      end

      it "removes the logo from osbl_data and purges the old logo" do
        # Create a contribution with an initial logo
        create_service = Contributions::CreateService.new(user: user, params: initial_params)
        status, contribution = create_service.call
        expect(status).to eq(:ok)

        # Store the initial logo's signed id for later verification
        initial_logo_signed_id = contribution.osbl_data["logo"]
        initial_logo_blob = ActiveStorage::Blob.find_signed(initial_logo_signed_id)
        expect(initial_logo_blob).to be_present

        # Create the service and capture the result before testing job enqueueing
        update_service = Contributions::UpdateService.new(contribution: contribution, params: update_params_without_logo)

        # Update the contribution without a logo and check job enqueueing
        expect {
          @update_status, @updated_contribution = update_service.call
        }.to have_enqueued_job.exactly(1).times

        # Verify the update was successful
        expect(@update_status).to eq(:ok)

        # Verify the logo is no longer in the osbl_data
        expect(@updated_contribution.osbl_data["logo"]).to be_nil

        # Verify the old logo blob has been purged
        perform_enqueued_jobs
        expect(ActiveStorage::Blob.exists?(initial_logo_blob.id)).to be false
      end
    end

    context "when removing documents from osbl_data" do
      let(:user) { create(:user) }
      let(:cause) { create(:cause) }

      let(:document_file) do
        tempfile = Tempfile.new(["document", ".pdf"])
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "document.pdf",
          type: "application/pdf"
        )
      end

      let(:initial_params) do
        {
          "body" => "Initial body",
          "osbl" => {
            "name" => "Initial OSBL",
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => cause.id}],
            "document_attachments_attributes" => [
              {
                "document_attributes" => {
                  "file" => document_file,
                  "name" => "Document 1",
                  "type" => "Autre",
                  "year" => Time.current.year
                }
              }
            ]
          }
        }
      end

      let(:update_params) do
        {
          "body" => "Updated body",
          "osbl" => {
            "name" => "Updated OSBL",
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => cause.id}],
            "document_attachments_attributes" => [] # Empty array to remove all documents
          }
        }
      end

      it "purges documents that are no longer present in the updated osbl_data" do
        # Create a contribution with an initial document
        create_service = Contributions::CreateService.new(user: user, params: initial_params)
        status, contribution = create_service.call
        expect(status).to eq(:ok)

        # Store the initial document's signed id for later verification
        document_signed_id = contribution.osbl_data["document_attachments_attributes"][0]["document_attributes"]["file"]
        document_blob = ActiveStorage::Blob.find_signed(document_signed_id)
        expect(document_blob).to be_present

        # Create the service and capture the result before testing job enqueueing
        update_service = Contributions::UpdateService.new(contribution: contribution, params: update_params)

        # Update the contribution and check job enqueueing
        expect {
          @update_status, @updated_contribution = update_service.call
        }.to have_enqueued_job.exactly(1).times

        # Verify the update was successful
        expect(@update_status).to eq(:ok)

        # Verify the document is no longer in the osbl_data
        expect(@updated_contribution.osbl_data["document_attachments_attributes"]).to be_empty

        # Verify the document blob has been purged
        perform_enqueued_jobs
        expect(ActiveStorage::Blob.exists?(document_blob.id)).to be false
      end
    end

    context "when adding a second document to osbl_data" do
      let(:user) { create(:user) }
      let(:cause) { create(:cause) }

      let(:first_document_file) do
        tempfile = Tempfile.new(["first_document", ".pdf"])
        File.write(tempfile.path, "First document content")
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "first_document.pdf",
          type: "application/pdf"
        )
      end

      let(:second_document_file) do
        tempfile = Tempfile.new(["second_document", ".pdf"])
        File.write(tempfile.path, "Second document content")
        ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "second_document.pdf",
          type: "application/pdf"
        )
      end

      let(:initial_params) do
        {
          "body" => "Initial body",
          "osbl" => {
            "name" => "Initial OSBL",
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => cause.id}],
            "document_attachments_attributes" => [
              {
                "document_attributes" => {
                  "file" => first_document_file,
                  "name" => "First Document",
                  "type" => "Autre",
                  "year" => Time.current.year
                }
              }
            ]
          }
        }
      end

      it "keeps the existing document and adds the new one without purging" do
        # Create a contribution with an initial document
        create_service = Contributions::CreateService.new(user: user, params: initial_params)
        status, contribution = create_service.call
        expect(status).to eq(:ok)

        # Store the initial document's signed id for later verification
        first_document_signed_id = contribution.osbl_data["document_attachments_attributes"][0]["document_attributes"]["file"]
        first_document_blob = ActiveStorage::Blob.find_signed(first_document_signed_id)
        expect(first_document_blob).to be_present

        # Create update params with both the existing document (by reference) and a new document
        update_params = {
          "body" => "Updated body",
          "osbl" => {
            "name" => "Updated OSBL",
            "tax_reduction" => "intérêt_général",
            "osbls_causes_attributes" => [{"cause_id" => cause.id}],
            "document_attachments_attributes" => [
              # Include the existing document by reference
              {
                "document_attributes" => {
                  "file" => {
                    "filename" => "first_document.pdf",
                    "url" => FileProcessor.generate_url(first_document_blob)
                  },
                  "name" => "First Document",
                  "type" => "Autre",
                  "year" => Time.current.year
                }
              },
              # Add a new document
              {
                "document_attributes" => {
                  "file" => second_document_file,
                  "name" => "Second Document",
                  "type" => "Autre",
                  "year" => Time.current.year
                }
              }
            ]
          }
        }

        # Create the service and capture the result before testing job enqueueing
        update_service = Contributions::UpdateService.new(contribution: contribution, params: update_params)

        # Update the contribution and check that no purge job is enqueued for the first document
        expect {
          @update_status, @updated_contribution = update_service.call
        }.not_to have_enqueued_job(ActiveStorage::PurgeJob)

        # Verify the update was successful
        expect(@update_status).to eq(:ok)

        # Verify both documents are in the osbl_data
        expect(@updated_contribution.osbl_data["document_attachments_attributes"].length).to eq(2)

        # Verify the first document is still in the osbl_data
        first_doc_in_updated = @updated_contribution.osbl_data["document_attachments_attributes"].find do |attachment|
          attachment["document_attributes"]["name"] == "First Document"
        end
        expect(first_doc_in_updated).to be_present

        # Verify the second document was added
        second_doc_in_updated = @updated_contribution.osbl_data["document_attachments_attributes"].find do |attachment|
          attachment["document_attributes"]["name"] == "Second Document"
        end
        expect(second_doc_in_updated).to be_present

        # Verify the first document blob still exists
        expect(ActiveStorage::Blob.exists?(first_document_blob.id)).to be true
      end
    end
  end
end
