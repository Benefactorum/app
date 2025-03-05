require "rails_helper"

RSpec.describe OsblImport, type: :model do
  subject(:osbl_import) { build(:osbl_import) }

  # Factory tests
  describe "factory" do
    it "has a valid factory" do
      expect(osbl_import).to be_valid
    end
  end

  # Validation tests
  describe "validations" do
    describe "osbl_uri" do
      it "requires osbl_uri" do
        osbl_import.osbl_uri = nil
        expect(osbl_import).not_to be_valid
        expect(osbl_import.errors[:osbl_uri]).to be_present
      end

      it "requires valid URI format" do
        osbl_import.osbl_uri = "invalid-uri"
        expect(osbl_import).not_to be_valid
        expect(osbl_import.errors[:osbl_uri]).to be_present
      end

      it "accepts valid http URI" do
        osbl_import.osbl_uri = "http://example.com"
        expect(osbl_import.errors[:osbl_uri]).not_to be_present
      end

      it "accepts valid https URI" do
        osbl_import.osbl_uri = "https://example.com"
        expect(osbl_import.errors[:osbl_uri]).not_to be_present
      end
    end
  end

  # Association tests
  describe "associations" do
    it "belongs to a user" do
      osbl_import.user = nil
      expect(osbl_import).not_to be_valid
      expect(osbl_import.errors[:user]).to be_present
    end

    it "can belong to a contribution" do
      osbl_import.contribution = nil
      expect(osbl_import).to be_valid
    end
  end

  # Enum tests
  describe "status enum" do
    it "defaults to initialized" do
      expect(osbl_import.status).to eq("initialized")
    end

    it "allows valid status transitions" do
      valid_statuses = %w[initialized cancelled failed timed_out extracted completed]
      valid_statuses.each do |status|
        osbl_import.status = status
        expect(osbl_import).to be_valid
      end
    end

    it "does not allow invalid status" do
      expect { osbl_import.status = "invalid_status" }.to raise_error(ArgumentError)
    end
  end

  # Data structure tests
  describe "extracted_data" do
    it "stores extracted data as a hash" do
      data = {
        "name" => "Test Organization",
        "tax_reduction" => "intérêt_général",
        "osbls_causes_attributes" => [
          {"name" => "Test Cause"}
        ]
      }
      osbl_import.extracted_data = data
      expect(osbl_import.extracted_data).to eq(data)
    end
  end
end
