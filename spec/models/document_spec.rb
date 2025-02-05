require "rails_helper"

RSpec.describe Document, type: :model do
  describe "factory" do
    it "is valid" do
      expect(create(:document)).to be_valid
    end
  end

  describe "database constraints" do
    it "raises error when type is null" do
      expect {
        Document.create!(type: nil, file: fixture_file_upload("spec/fixtures/files/sample.pdf", "application/pdf"))
      }.to raise_error(ActiveRecord::NotNullViolation)
    end

    it "raises error when year is null for rapport_activite type" do
      expect {
        Document.create!(
          type: "Rapport d'activité",
          year: nil,
          file: fixture_file_upload("spec/fixtures/files/sample.pdf", "application/pdf")
        )
      }.to raise_error(ActiveRecord::StatementInvalid, /year_required_for_specific_types/)
    end

    it "raises error when year is null for rapport_financier type" do
      expect {
        Document.create!(
          type: "Rapport financier",
          year: nil,
          file: fixture_file_upload("spec/fixtures/files/sample.pdf", "application/pdf")
        )
      }.to raise_error(ActiveRecord::StatementInvalid, /year_required_for_specific_types/)
    end

    it "raises error when year is less than 1000" do
      expect {
        Document.create!(
          type: "Rapport d'activité",
          year: 999,
          file: fixture_file_upload("spec/fixtures/files/sample.pdf", "application/pdf")
        )
      }.to raise_error(ActiveRecord::StatementInvalid, /year_as_4_digits/)
    end
  end

  describe "validations" do
    it "is invalid when year is greater than the current year" do
      document = build(:document, year: Time.current.year + 1)
      expect(document).not_to be_valid
      expect(document.errors[:year]).to be_present
    end
  end

  describe "active storage attachment" do
    it "is invalid without a file" do
      document = build(:document, file: nil)
      expect(document).not_to be_valid
      expect(document.errors[:file]).to be_present
    end

    it "is invalid with non-PDF file" do
      document = build(:document, file: fixture_file_upload("spec/fixtures/files/invalid_file_type.svg", "image/svg"))
      expect(document).not_to be_valid
      expect(document.errors[:file]).to be_present
    end

    it "is invalid with file larger than 5MB" do
      allow_any_instance_of(ActiveStorage::Blob).to receive(:byte_size).and_return(6.megabytes)

      document = build(:document, file: fixture_file_upload("spec/fixtures/files/sample.pdf", "application/pdf"))
      expect(document).not_to be_valid
      expect(document.errors[:file]).to be_present
    end
  end

  describe "associations" do
    # it "has many attachables through document_attachments" do
    #   expect(Document.new).to respond_to(:attachables)
    # end

    it "destroys dependent document_attachments when deleted" do
      document = create(:document, file: fixture_file_upload("spec/fixtures/files/sample.pdf", "application/pdf"))
      osbl = create(:osbl)
      osbl.documents << document

      expect { document.destroy }.to change { DocumentAttachment.count }.by(-1)
    end
  end

  describe "validations" do
    subject(:document) do
      build(:document, file: fixture_file_upload("spec/fixtures/files/sample.pdf", "application/pdf"))
    end

    it "is valid with valid attributes" do
      expect(document).to be_valid
    end

    it "is valid with year for rapport_activite" do
      document.type = "Rapport d'activité"
      document.year = 2024
      expect(document).to be_valid
    end

    it "is valid with year for rapport_financier" do
      document.type = "Rapport financier"
      document.year = 2024
      expect(document).to be_valid
    end
  end
end
