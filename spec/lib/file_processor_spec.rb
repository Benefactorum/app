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
        expect(result["filename"]).to be_present
        expect(result["url"]).to be_present
        expect(result["key"]).to be_present
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
          {"filename" => blob.filename.to_s, "key" => blob.key}
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

  describe ".download_from_url" do
    let(:url) { "https://example.com/file.pdf" }
    let(:response_body) { "fake file content" }
    let(:http_response) { instance_double(Net::HTTPSuccess, body: response_body, code: "200", is_a?: true) }
    let(:blob) { instance_double(ActiveStorage::Blob, signed_id: "test_signed_id") }

    context "when url is blank" do
      it "returns nil" do
        expect(described_class.download_from_url(nil)).to be_nil
        expect(described_class.download_from_url("")).to be_nil
      end
    end

    context "when url is valid" do
      before do
        allow(Net::HTTP).to receive(:get_response).and_return(http_response)
        allow(ActiveStorage::Blob).to receive(:create_and_upload!).and_return(blob)
      end

      it "downloads the file and creates a blob" do
        result = described_class.download_from_url(url)

        expect(Net::HTTP).to have_received(:get_response)
        expect(ActiveStorage::Blob).to have_received(:create_and_upload!).with(
          hash_including(
            io: kind_of(StringIO),
            filename: "file.pdf",
            content_type: "application/pdf"
          )
        )
        expect(result).to eq("test_signed_id")
      end
    end

    context "with a URL that has no filename" do
      let(:url) { "https://example.com/" }

      before do
        allow(Net::HTTP).to receive(:get_response).and_return(http_response)
        allow(ActiveStorage::Blob).to receive(:create_and_upload!).and_return(blob)
      end

      it "uses a default filename" do
        result = described_class.download_from_url(url)

        expect(ActiveStorage::Blob).to have_received(:create_and_upload!).with(
          hash_including(
            filename: "fichier_téléchargé",
            content_type: "application/octet-stream"
          )
        )
        expect(result).to eq("test_signed_id")
      end
    end

    context "when an HTTP error occurs during download" do
      let(:error_response) { instance_double(Net::HTTPNotFound, code: "404", is_a?: false) }

      before do
        allow(Net::HTTP).to receive(:get_response).and_return(error_response)
        allow(Rails.logger).to receive(:error)
      end

      it "logs the error and returns nil" do
        result = described_class.download_from_url(url)

        expect(Rails.logger).to have_received(:error).with(/Failed to download file/)
        expect(result).to be_nil
      end
    end

    context "when a network error occurs" do
      before do
        allow(Net::HTTP).to receive(:get_response).and_raise(SocketError.new("Failed to connect"))
        allow(Rails.logger).to receive(:error)
      end

      it "logs the error and returns nil" do
        result = described_class.download_from_url(url)

        expect(Rails.logger).to have_received(:error).with(/Failed to download file/)
        expect(result).to be_nil
      end
    end
  end
end
