require "rails_helper"

RSpec.describe OsblCreationFromImportJob, type: :job do
  describe "#perform" do
    let(:extracted_data) do
      {
        "logo" => "https://universsel.org/wp-content/uploads/2023/08/cropped-logoUNS_HD-1-270x270.png",
        "name" => "UNIVERS-SEL",
        "website" => "https://universsel.org",
        "osbl_type" => "association",
        "description" => "UNIVERS-SEL is an international solidarity association supporting salt and rice producers worldwide, focusing on sustainable practices and community empowerment in mangrove areas.",
        "creation_year" => 1989,
        "tax_reduction" => "intérêt_général",
        "public_utility" => true,
        "geographical_scale" => "international",
        "locations_attributes" => [
          {
            "name" => "UNIVERS-SEL",
            "type" => "Siège social",
            "website" => "https://universsel.org",
            "description" => "Organisation engagée dans le développement durable et l'égalité des genres.",
            "address_attributes" => {
              "city" => "",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Siège de l'association",
            "type" => "Siège social",
            "website" => "",
            "description" => "",
            "address_attributes" => {
              "city" => "Guérande",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          }
        ],
        "osbls_causes_attributes" => [
          {"name" => "Environnement"},
          {"name" => "Aide internationale"}
        ],
        "osbls_labels_attributes" => [],
        "osbls_keywords_attributes" => [
          {"name" => "saliculture"},
          {"name" => "artisanat"}
        ],
        "annual_finances_attributes" => [],
        "document_attachments_attributes" => [],
        "osbls_intervention_areas_attributes" => [
          {"name" => "Bénin"},
          {"name" => "Guinée"}
        ]
      }
    end

    let(:user) { create(:user) }
    let(:osbl_import) { create(:osbl_import, user: user, extracted_data: extracted_data) }

    before do
      Osbl::Cause.create!(name: "Environnement")
      Osbl::Cause.create!(name: "Aide internationale")
    end

    it "finds the OsblImport by id" do
      allow(OsblImport).to receive(:find).and_call_original
      described_class.perform_now(osbl_import.id)
      expect(OsblImport).to have_received(:find).with(osbl_import.id)
    end

    context "when the import is successful" do
      it "creates a contribution" do
        expect { described_class.perform_now(osbl_import.id) }
          .to change(Contribution, :count).by(1)
      end

      it "updates the osbl_import status to completed" do
        described_class.perform_now(osbl_import.id)
        expect(osbl_import.reload.status).to eq("completed")
      end

      it "associates the contribution with the osbl_import" do
        described_class.perform_now(osbl_import.id)
        expect(osbl_import.reload.contribution).to be_present
      end

      it "creates a contribution owned by the import's user" do
        described_class.perform_now(osbl_import.id)
        expect(osbl_import.reload.contribution.user).to eq(user)
      end
    end

    context "when required fields are missing" do
      context "when name is missing" do
        let(:extracted_data) { super().merge("name" => nil) }

        it "raises an InvalidOsblImportData error" do
          expect {
            described_class.perform_now(osbl_import.id)
          }.to raise_error(OsblCreationFromImportJob::InvalidOsblImportData)
        end
      end

      context "when tax_reduction is missing" do
        let(:extracted_data) { super().merge("tax_reduction" => nil) }

        it "raises an InvalidOsblImportData error" do
          expect {
            described_class.perform_now(osbl_import.id)
          }.to raise_error(OsblCreationFromImportJob::InvalidOsblImportData)
        end
      end

      context "when osbls_causes_attributes is missing" do
        let(:extracted_data) { super().merge("osbls_causes_attributes" => []) }

        it "raises an InvalidOsblImportData error" do
          expect {
            described_class.perform_now(osbl_import.id)
          }.to raise_error(OsblCreationFromImportJob::InvalidOsblImportData)
        end
      end
    end

    context "when optional fields are missing" do
      let(:optional_fields) do
        %w[
          logo website osbl_type description creation_year public_utility
          geographical_scale locations_attributes osbls_labels_attributes
          osbls_keywords_attributes annual_finances_attributes
          document_attachments_attributes osbls_intervention_areas_attributes
        ]
      end

      it "processes the import successfully when each optional field is missing" do
        optional_fields.each do |field|
          data = extracted_data.deep_dup
          data.delete(field)
          osbl_import.update!(extracted_data: data)

          expect {
            described_class.perform_now(osbl_import.id)
          }.not_to raise_error
        end
      end
    end

    context "when the OsblImport is not found" do
      it "raises an ActiveRecord::RecordNotFound error" do
        expect {
          described_class.perform_now(-1)
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
