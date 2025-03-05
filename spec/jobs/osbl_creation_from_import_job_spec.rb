require "rails_helper"

RSpec.describe OsblCreationFromImportJob, type: :job do
  describe "#perform" do
    let(:user) { create(:user) }
    let(:mandatory_data) do
      {
        "name" => "Les Restos du Cœur",
        "tax_reduction" => "aide_aux_personnes_en_difficulté",
        "osbls_causes_attributes" => [
          {"name" => "Lutte contre la précarité"}
        ]
      }
    end
    let(:extracted_data) { mandatory_data }
    let(:osbl_import) { create(:osbl_import, user: user, extracted_data: extracted_data, status: "extracted") }

    before do
      Osbl::Cause.create!(name: "Lutte contre la précarité")
    end

    shared_examples "a successful import" do
      it "creates a contribution and updates the import status" do
        expect { described_class.perform_now(osbl_import.id) }
          .to change(Contribution, :count).by(1)

        expect(osbl_import.reload.status).to eq("completed")
        expect(osbl_import.contribution).to be_present
        expect(osbl_import.contribution.user).to eq(user)
      end
    end

    shared_examples "a validation error" do |error_message|
      it "raises an InvalidOsblImportData error" do
        expect { described_class.perform_now(osbl_import.id) }
          .to raise_error(OsblCreationFromImportJob::InvalidOsblImportData, error_message)
      end
    end

    context "when the import is successful" do
      include_examples "a successful import"
    end

    context "when processing attributes" do
      describe "logo processing" do
        context "with valid URL" do
          let(:extracted_data) { mandatory_data.merge("logo" => "https://example.com/logo.png") }
          let(:logo_file) { fixture_file_upload("valid_file.png", "image/png") }
          let(:mock_response) do
            instance_double(
              Net::HTTPSuccess,
              body: File.read(logo_file.path),
              is_a?: true
            )
          end

          before do
            allow(Net::HTTP).to receive(:get_response)
              .with(URI("https://example.com/logo.png"))
              .and_return(mock_response)
          end

          include_examples "a successful import"

          it "processes the logo" do
            described_class.perform_now(osbl_import.id)
            contribution = osbl_import.reload.contribution
            expect(contribution.contributable.osbl_data["logo"]).to be_present
            expect(ActiveStorage::Blob.find_signed(contribution.contributable.osbl_data["logo"])).to be_present
          end
        end

        context "with invalid URL" do
          let(:extracted_data) { mandatory_data.merge("logo" => "invalid_url") }

          before do
            allow(Net::HTTP).to receive(:get_response)
              .with(URI("invalid_url"))
              .and_return(instance_double(Net::HTTPNotFound, code: "404", is_a?: false))
          end

          include_examples "a successful import"

          it "creates contribution without logo" do
            described_class.perform_now(osbl_import.id)
            expect(osbl_import.reload.contribution.contributable.osbl_data["logo"]).to be_nil
          end
        end
      end

      describe "causes processing" do
        context "with multiple valid causes" do
          let(:extracted_data) do
            mandatory_data.merge(
              "osbls_causes_attributes" => [
                {"name" => "Lutte contre la précarité"},
                {"name" => "Environnement"}
              ]
            )
          end

          before do
            Osbl::Cause.create!(name: "Environnement")
          end

          include_examples "a successful import"

          it "associates with existing causes" do
            described_class.perform_now(osbl_import.id)
            contribution = osbl_import.reload.contribution
            expect(contribution.contributable.osbl_data["osbls_causes_attributes"].pluck("name"))
              .to match_array(["Lutte contre la précarité", "Environnement"])
          end
        end

        context "with non-existing cause" do
          let(:extracted_data) do
            mandatory_data.merge(
              "osbls_causes_attributes" => [
                {"name" => "Non-existent Cause"},
                {"name" => "Lutte contre la précarité"}
              ]
            )
          end

          before do
            allow(Rails.logger).to receive(:error).with(any_args)
            expect(Rails.logger).to receive(:error).with("Cause not found: Non-existent Cause")
          end

          include_examples "a successful import"

          it "only includes existing causes" do
            described_class.perform_now(osbl_import.id)
            expect(osbl_import.reload.contribution.contributable.osbl_data["osbls_causes_attributes"].pluck("name"))
              .to match_array(["Lutte contre la précarité"])
          end
        end
      end

      describe "keywords and intervention areas processing" do
        let(:extracted_data) do
          mandatory_data.merge(
            "osbls_keywords_attributes" => [
              {"name" => "Keyword1"},
              {"name" => "Keyword1"}, # Duplicate
              {"name" => "Keyword2"}
            ],
            "osbls_intervention_areas_attributes" => [
              {"name" => "Area1"},
              {"name" => "Area1"}, # Duplicate
              {"name" => "Area2"}
            ]
          )
        end

        before do
          Osbl::Keyword.create!(name: "Keyword1")
          Osbl::InterventionArea.create!(name: "Area1")
        end

        include_examples "a successful import"

        it "creates records and removes duplicates" do
          described_class.perform_now(osbl_import.id)
          contribution = osbl_import.reload.contribution

          keywords = contribution.contributable.osbl_data["osbls_keywords_attributes"]
          expect(keywords.pluck("name")).to match_array(["Keyword1", "Keyword2"])
          expect(Osbl::Keyword.pluck(:name)).to match_array(["Keyword1", "Keyword2"])

          areas = contribution.contributable.osbl_data["osbls_intervention_areas_attributes"]
          expect(areas.pluck("name")).to match_array(["Area1", "Area2"])
          expect(Osbl::InterventionArea.pluck(:name)).to match_array(["Area1", "Area2"])
        end
      end

      describe "labels processing" do
        let(:label1) { create(:label, name: "Label1") }
        let(:label2) { create(:label, name: "Label2") }
        let(:extracted_data) do
          mandatory_data.merge(
            "osbls_labels_attributes" => [
              {"name" => label1.name},
              {"name" => label2.name},
              {"name" => label1.name}, # Duplicate
              {"name" => "Non-existent Label"}
            ]
          )
        end

        before do
          allow(Rails.logger).to receive(:error).with(any_args)
          expect(Rails.logger).to receive(:error).with("Label not found: Non-existent Label")
        end

        include_examples "a successful import"

        it "associates only existing labels and removes duplicates" do
          described_class.perform_now(osbl_import.id)
          contribution = osbl_import.reload.contribution
          labels = contribution.contributable.osbl_data["osbls_labels_attributes"]
          expect(labels.pluck("name")).to match_array([label1.name, label2.name])
        end
      end

      describe "annual finances processing" do
        context "with valid financial data" do
          let(:extracted_data) do
            mandatory_data.merge(
              "annual_finances_attributes" => [
                {
                  "year" => 2023,
                  "budget" => 1000,
                  "treasury" => 500,
                  "certified" => true,
                  "employees_count" => 10,
                  "fund_sources_attributes" => [
                    {"type" => "Dons", "percent" => 70},
                    {"type" => "Aides publiques", "percent" => 20}
                  ],
                  "fund_allocations_attributes" => [
                    {"type" => "Missions sociales", "percent" => 60},
                    {"type" => "Frais de fonctionnement", "percent" => 30}
                  ]
                },
                {
                  "year" => 2023,
                  "budget" => 2000,
                  "treasury" => nil,
                  "certified" => nil,
                  "employees_count" => nil,
                  "fund_sources_attributes" => [
                    {"type" => "Dons", "percent" => 70},
                    {"type" => "Aides publiques", "percent" => 30, "amount" => 300}
                  ],
                  "fund_allocations_attributes" => [
                    {"type" => "Missions sociales", "percent" => 60},
                    {"type" => "Frais de fonctionnement", "percent" => 40, "amount" => 400}
                  ]
                }
              ]
            )
          end

          include_examples "a successful import"

          it "processes financial data correctly" do
            described_class.perform_now(osbl_import.id)
            contribution = osbl_import.reload.contribution
            finances = contribution.contributable.osbl_data["annual_finances_attributes"]

            expect(finances.size).to eq(1)
            expect(finances.first["budget"]).to eq(2000)

            expect(finances.first["fund_sources_attributes"]).to be_present
            expect(finances.first["fund_allocations_attributes"]).to be_present
            expect(finances.first["fund_sources_attributes"].pluck("type")).to match_array(["Dons", "Aides publiques"])
            expect(finances.first["fund_allocations_attributes"].pluck("type")).to match_array(["Missions sociales", "Frais de fonctionnement"])
          end
        end

        context "with invalid percentages" do
          let(:extracted_data) do
            mandatory_data.merge(
              "annual_finances_attributes" => [
                {
                  "year" => 2023,
                  "budget" => 1000,
                  "fund_sources_attributes" => [
                    {"type" => "Dons", "percent" => 70},
                    {"type" => "Aides publiques", "percent" => 20} # Sum is 90%, not 100%
                  ],
                  "fund_allocations_attributes" => [
                    {"type" => "Missions sociales", "percent" => 60},
                    {"type" => "Frais de fonctionnement", "percent" => 30} # Sum is 90%, not 100%
                  ]
                }
              ]
            )
          end

          include_examples "a successful import"

          it "excludes invalid financial breakdowns" do
            described_class.perform_now(osbl_import.id)
            contribution = osbl_import.reload.contribution
            finance = contribution.contributable.osbl_data["annual_finances_attributes"].first

            expect(finance["fund_sources_attributes"]).to be_nil
            expect(finance["fund_allocations_attributes"]).to be_nil
          end
        end
      end

      describe "document attachments processing" do
        let(:extracted_data) do
          mandatory_data.merge(
            "document_attachments_attributes" => [
              {
                "type" => "Rapport d'activité",
                "file" => "https://example.com/doc.pdf",
                "name" => "Annual Report",
                "year" => 2023
              },
              {
                "type" => "Statuts",
                "file" => "invalid_url",
                "name" => "Statutes",
                "year" => 2023
              }
            ]
          )
        end
        let(:pdf_file) { fixture_file_upload("sample.pdf", "application/pdf") }

        before do
          # Default response for any HTTP request
          allow(Net::HTTP).to receive(:get_response)
            .and_return(instance_double(Net::HTTPNotFound, code: "404", is_a?: false))

          # Specific response for the valid document
          allow(Net::HTTP).to receive(:get_response)
            .with(URI("https://example.com/doc.pdf"))
            .and_return(instance_double(Net::HTTPSuccess, body: File.read(pdf_file.path), is_a?: true))
        end

        include_examples "a successful import"

        it "processes valid documents and skips invalid ones" do
          described_class.perform_now(osbl_import.id)
          contribution = osbl_import.reload.contribution
          attachments = contribution.contributable.osbl_data["document_attachments_attributes"]

          expect(attachments.size).to eq(1)
          expect(attachments.first["document_attributes"]["type"]).to eq("Rapport d'activité")
          expect(attachments.first["document_attributes"]["file"]).to be_present
          expect(ActiveStorage::Blob.find_signed(attachments.first["document_attributes"]["file"])).to be_present
        end
      end

      describe "locations processing" do
        let(:extracted_data) do
          mandatory_data.merge(
            "locations_attributes" => [
              {
                "type" => "Siège social",
                "address_attributes" => {
                  "street_number" => "123",
                  "street_name" => "Main St",
                  "postal_code" => "75001",
                  "city" => "Paris"
                }
              },
              {
                "type" => "Antenne",
                "address_attributes" => {
                  "street_number" => "42",
                  "street_name" => "Low Score St",
                  "postal_code" => "75002",
                  "city" => "Paris"
                }
              }
            ]
          )
        end

        before do
          # Valid address with high score
          allow(FrenchAddressApi).to receive(:search)
            .with(/Main St/)
            .and_return({
              "features" => [
                {
                  "properties" => {
                    "score" => 0.9,
                    "housenumber" => "123",
                    "street" => "Main St",
                    "postcode" => "75001",
                    "city" => "Paris"
                  },
                  "geometry" => {
                    "coordinates" => [2.3522, 48.8566]
                  }
                }
              ]
            })

          # Low confidence address
          allow(FrenchAddressApi).to receive(:search)
            .with(/Low Score St/)
            .and_return({
              "features" => [
                {
                  "properties" => {
                    "score" => 0.5,
                    "housenumber" => "42",
                    "street" => "Low Score St",
                    "postcode" => "75002",
                    "city" => "Paris"
                  },
                  "geometry" => {
                    "coordinates" => [2.3522, 48.8566]
                  }
                }
              ]
            })
        end

        include_examples "a successful import"

        it "processes valid locations and skips low confidence ones" do
          described_class.perform_now(osbl_import.id)
          contribution = osbl_import.reload.contribution
          locations = contribution.contributable.osbl_data["locations_attributes"]

          expect(locations.size).to eq(1)
          expect(locations.first["type"]).to eq("Siège social")
          expect(locations.first["address_attributes"]["street_name"]).to eq("Main St")
          expect(locations.first["address_attributes"]["latitude"]).to eq(48.8566)
          expect(locations.first["address_attributes"]["longitude"]).to eq(2.3522)
        end

        context "with API errors" do
          let(:extracted_data) do
            mandatory_data.merge(
              "locations_attributes" => [
                {
                  "type" => "Siège social",
                  "address_attributes" => {
                    "street_number" => "123",
                    "street_name" => "Error St",
                    "postal_code" => "75001",
                    "city" => "Paris"
                  }
                }
              ]
            )
          end

          it "retries and succeeds on subsequent attempts" do
            # First call fails, second succeeds
            expect(FrenchAddressApi).to receive(:search)
              .and_raise(FrenchAddressApi::ApiError, "API Error")
              .ordered

            expect(FrenchAddressApi).to receive(:search)
              .and_return({
                "features" => [
                  {
                    "properties" => {
                      "score" => 0.9,
                      "housenumber" => "123",
                      "street" => "Error St",
                      "postcode" => "75001",
                      "city" => "Paris"
                    },
                    "geometry" => {
                      "coordinates" => [2.3522, 48.8566]
                    }
                  }
                ]
              })
              .ordered

            # Skip actual sleep in tests
            allow_any_instance_of(Object).to receive(:sleep)

            described_class.perform_now(osbl_import.id)
            contribution = osbl_import.reload.contribution
            locations = contribution.contributable.osbl_data["locations_attributes"]

            expect(locations.first["type"]).to eq("Siège social")
            expect(locations.first["address_attributes"]["street_name"]).to eq("Error St")
          end

          it "gives up after maximum retries" do
            # All calls fail
            expect(FrenchAddressApi).to receive(:search)
              .and_raise(FrenchAddressApi::ApiError, "API Error")
              .exactly(3).times

            allow_any_instance_of(Object).to receive(:sleep)
            expect(Rails.logger).to receive(:error).with(/Failed to get confirmed address/)

            described_class.perform_now(osbl_import.id)
            contribution = osbl_import.reload.contribution
            expect(contribution.contributable.osbl_data["locations_attributes"]).to be_empty
          end
        end
      end
    end

    context "when required fields are missing" do
      {
        "name" => /Name champs obligatoire/,
        "tax_reduction" => /Tax reduction champs obligatoire/,
        "osbls_causes_attributes" => /Au moins une cause est requise/
      }.each do |field, error_pattern|
        context "when #{field} is missing" do
          let(:extracted_data) { mandatory_data.except(field) }
          include_examples "a validation error", error_pattern
        end
      end
    end

    context "when the OsblImport is not found" do
      it "raises an ActiveRecord::RecordNotFound error" do
        expect { described_class.perform_now(-1) }
          .to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
