require "rails_helper"

RSpec.describe FileProcessor do
  describe ".process" do
    context "when file is an uploaded file" do
      it "creates a blob and returns signed id" do
        tempfile = Tempfile.new(["test", ".png"])
        file = ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "valid_file.png",
          type: "image/png"
        )
        signed_id = described_class.process(file)

        expect(signed_id).to be_a(String)
        expect(ActiveStorage::Blob.find_signed(signed_id)).to be_present
      end
    end

    context "when file is a signed id string" do
      it "returns blob info hash" do
        tempfile = Tempfile.new(["test", ".png"])
        file = ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "valid_file.png",
          type: "image/png"
        )
        signed_id = ActiveStorage::Blob.create_and_upload!(
          io: file.tempfile,
          filename: file.original_filename,
          content_type: file.content_type
        ).signed_id

        result = described_class.process(signed_id)

        expect(result).to be_a(Hash)
        expect(result[:filename]).to be_present
        expect(result[:url]).to be_present
      end
    end

    context "when file is a hash with filename" do
      it "returns blob signed id" do
        tempfile = Tempfile.new(["test", ".png"])
        file = ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "valid_file.png",
          type: "image/png"
        )
        blob = ActiveStorage::Blob.create_and_upload!(
          io: file.tempfile,
          filename: file.original_filename,
          content_type: file.content_type
        )

        result = described_class.process(
          {"filename" => blob.filename.to_s}
        )

        expect(result).to be_a(String)
        expect(ActiveStorage::Blob.find_signed(result)).to be_present
      end
    end

    context "when file is an ActiveStorage::Attachment" do
      it "returns blob info hash" do
        tempfile = Tempfile.new(["test", ".png"])
        file = ActionDispatch::Http::UploadedFile.new(
          tempfile: tempfile,
          filename: "valid_file.png",
          type: "image/png"
        )
        # blob = ActiveStorage::Blob.create_and_upload!(
        #   io: file.tempfile,
        #   filename: file.original_filename,
        #   content_type: file.content_type
        # )

        contribution = create(:contribution, files: [file])

        result = described_class.process(contribution.files.first)

        expect(result).to be_a(Hash)
        expect(result["filename"]).to be_present
        expect(result["url"]).to be_present
      end
    end

    context "with unsupported file type" do
      it "raises ArgumentError" do
        expect {
          described_class.process(123)
        }.to raise_error(ArgumentError)
      end
    end
  end
end
