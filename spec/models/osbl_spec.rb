require "rails_helper"

RSpec.describe Osbl, type: :model do
  subject(:osbl) { build(:osbl) }

  # Factory tests
  describe "factory" do
    it "has a valid factory" do
      expect(osbl).to be_valid
    end
  end

  # Validation tests
  describe "validations" do
    describe "name" do
      it "requires name" do
        osbl.name = nil
        expect(osbl).not_to be_valid
        expect(osbl.errors[:name]).to be_present
      end

      it "requires unique name" do
        existing_osbl = create(:osbl)
        osbl.name = existing_osbl.name
        expect(osbl).not_to be_valid
        expect(osbl.errors[:name]).to be_present
      end
    end

    describe "website" do
      it "requires unique website if present" do
        existing_osbl = create(:osbl, website: "https://example.com")
        osbl.website = existing_osbl.website
        expect(osbl).not_to be_valid
        expect(osbl.errors[:website]).to be_present
      end
    end

    describe "description" do
      it "limits description to 300 characters" do
        osbl.description = "a" * 301
        expect(osbl).not_to be_valid
        expect(osbl.errors[:description]).to be_present
      end
    end

    it "validates creation_year is not in the future" do
      osbl.creation_year = Time.current.year + 1
      expect(osbl).not_to be_valid
      expect(osbl.errors[:creation_year]).to be_present
    end

    it "requires at least one cause" do
      osbl.causes = []
      expect(osbl).not_to be_valid
      expect(osbl.errors[:osbls_causes]).to be_present
    end

    describe "associated documents" do
      it "osbl is invalid with an invalid document" do
        osbl = build(:osbl, document_attachments_attributes: [{
          document_attributes: {
            type: "Autre",
            name: "Test document"
            # file is missing, making document invalid
          }
        }])

        expect(osbl).not_to be_valid
        expect(osbl.errors[:"document_attachments.document.file"]).to be_present
      end
    end
  end

  # Association tests
  describe "associations" do
    it "destroys dependent associations" do
      osbl = create(:osbl)
      expect { osbl.destroy }.to change { OsblsCause.count }.by(-1)
    end
  end

  # Logo attachment validation tests
  describe "logo attachment" do
    it "validates logo file size" do
      osbl.logo.attach(
        io: StringIO.new("a" * 2.megabytes),
        filename: "large_logo.png",
        content_type: "image/png"
      )
      expect(osbl).not_to be_valid
      expect(osbl.errors[:logo]).to be_present
    end

    it "validates logo content type" do
      osbl.logo.attach(
        io: StringIO.new("fake pdf content"),
        filename: "logo.pdf",
        content_type: "application/pdf"
      )
      expect(osbl).not_to be_valid
      expect(osbl.errors[:logo]).to be_present
    end
  end

  describe "db constraints" do
    it "creation_year must be 4 digits" do
      osbl.creation_year = 123
      expect {
        osbl.save!
      }.to raise_error(ActiveRecord::StatementInvalid, /creation_year_as_4_digits/)
    end
  end
end
