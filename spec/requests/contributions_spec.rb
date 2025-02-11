require "rails_helper"

RSpec.describe "/contributions", type: :request, inertia: true do
  describe "GET /index" do
    let(:user) { create(:user) }
    subject { get user_contributions_url(user) }

    it_behaves_like "require_authentication"

    context "signed as another user" do
      let(:other_user) { create(:user) }

      before do
        sign_in_as(other_user)
      end

      it_behaves_like "only_for_current_user"
    end

    context "for current user" do
      before do
        sign_in_as(user)
      end

      it "renders a successful response" do
        subject
        expect(response).to be_successful
      end
    end
  end

  describe "GET /mes-contributions" do
    subject { get my_contributions_url }

    it_behaves_like "require_authentication"

    context "for current user" do
      before do
        sign_in_as(create(:user))
      end

      it "renders a successful response" do
        subject
        expect(response).to be_successful
      end
    end
  end

  describe "GET /mes-contributions/ajouter-une-association" do
    subject { get my_new_contribution_url }

    it_behaves_like "require_authentication"

    context "for current user" do
      before do
        sign_in_as(create(:user))
      end

      it "renders a successful response" do
        subject
        expect(response).to be_successful
      end
    end
  end

  describe "POST /create" do
    let(:user) { create(:user) }
    subject { post user_contributions_url(user), params: params }
    let(:params) { valid_attributes }

    it_behaves_like "only_for_current_user"

    before do
      sign_in_as(user)
    end

    # Fixture files for logo and document attachments
    let(:logo) do
      Rack::Test::UploadedFile.new(
        Rails.root.join("spec/fixtures/files/valid_file.png"),
        "image/png"
      )
    end

    let(:document_file) do
      Rack::Test::UploadedFile.new(
        Rails.root.join("spec/fixtures/files/sample.pdf"),
        "application/pdf"
      )
    end

    let(:valid_attributes) do
      {
        contribution: {
          body: "Je suis le créateur de Benefactorum, vous trouverez toutes les informations sur le projet sur le site de Benefactorum et dans les documents associés.",
          files: [document_file],
          osbl: {
            name: "Benefactorum",
            website: "https://benefactorum.org/",
            logo: logo,
            description: "Benefactorum est la première plateforme de dons collaborative et à but non-lucratif, qui vous permet de découvrir et de soutenir facilement toutes les causes qui vous tiennent à cœur !",
            osbls_causes_attributes: [{cause_id: 13}],
            tax_reduction: "intérêt_général",
            osbls_keywords_attributes: [
              {keyword_id: 36},
              {keyword_id: 37},
              {keyword_id: 38},
              {keyword_id: 39}
            ],
            geographical_scale: "national",
            osbl_type: "association",
            creation_year: 2023,
            document_attachments_attributes: {
              "0" => {
                document_attributes: {
                  type: "Statuts",
                  file: document_file,
                  name: "Statuts de l'association",
                  year: 2023
                }
              },
              "1" => {
                document_attributes: {
                  type: "Statuts",
                  file: document_file,
                  name: "Statuts du fonds de dotation",
                  year: 2023
                }
              }
            },
            locations_attributes: {
              "0" => {
                type: "Siège social",
                address_attributes: {
                  street_number: "12",
                  street_name: "Rue du moulin",
                  postal_code: "44260",
                  city: "La Chapelle-Launay",
                  latitude: "47.371354",
                  longitude: "-1.969269"
                }
              }
            }
          }
        }
      }
    end

    let(:invalid_attributes) do
      {
        contribution: {
          osbl: {
            name: "OSBL 1"
            # missing required osbls_causes_attributes
          }
        }
      }
    end

    context "with valid parameters" do
      before do
        create(:cause, id: 13)
        create(:keyword, id: 36)
        create(:keyword, id: 37)
        create(:keyword, id: 38)
        create(:keyword, id: 39)
      end

      it "creates a new Contribution and transforms file parameters" do
        expect {
          subject
        }.to change(Contribution, :count).by(1)
          .and change(ActiveStorage::Blob, :count).by(4) # 1 file + 1 logo + 2 documents

        contribution = Contribution.last
        expect(contribution.body).to eq("Je suis le créateur de Benefactorum, vous trouverez toutes les informations sur le projet sur le site de Benefactorum et dans les documents associés.")
        expect(contribution.files).to be_attached

        osbl = Osbl.create!(contribution.contributable.osbl_data)
        expect(osbl.name).to eq("Benefactorum")
        expect(osbl.website).to eq("https://benefactorum.org/")
        expect(osbl.logo).to be_attached
        expect(osbl.description).to eq("Benefactorum est la première plateforme de dons collaborative et à but non-lucratif, qui vous permet de découvrir et de soutenir facilement toutes les causes qui vous tiennent à cœur !")
        expect(osbl.tax_reduction).to eq("intérêt_général")
        expect(osbl.geographical_scale).to eq("national")
        expect(osbl.osbl_type).to eq("association")
        expect(osbl.creation_year).to eq(2023)

        # Check causes
        expect(osbl.osbls_causes.count).to eq(1)
        expect(osbl.osbls_causes.first.cause_id).to eq(13)

        # Check keywords
        expect(osbl.osbls_keywords.count).to eq(4)
        expect(osbl.osbls_keywords.pluck(:keyword_id)).to match_array([36, 37, 38, 39])

        # Check documents
        expect(osbl.document_attachments.count).to eq(2)
        first_doc = osbl.document_attachments.first.document
        second_doc = osbl.document_attachments.second.document

        expect(first_doc.type).to eq("Statuts")
        expect(first_doc.name).to eq("Statuts de l'association")
        expect(first_doc.year).to eq(2023)
        expect(first_doc.file).to be_attached

        expect(second_doc.type).to eq("Statuts")
        expect(second_doc.name).to eq("Statuts du fonds de dotation")
        expect(second_doc.year).to eq(2023)
        expect(second_doc.file).to be_attached

        # Check location
        expect(osbl.locations.count).to eq(1)
        location = osbl.locations.first
        expect(location.type).to eq("Siège social")

        address = location.address
        expect(address.street_number).to eq("12")
        expect(address.street_name).to eq("Rue du moulin")
        expect(address.postal_code).to eq("44260")
        expect(address.city).to eq("La Chapelle-Launay")
        expect(address.latitude).to eq(47.371354)
        expect(address.longitude).to eq(-1.969269)
      end

      it "redirects to the contributions list" do
        subject
        expect(response).to redirect_to(my_contributions_url)
      end
    end

    context "with invalid parameters" do
      let(:params) { invalid_attributes }
      it "does not create a new Contribution" do
        expect { subject }.to change(Contribution, :count).by(0)
      end

      it "redirects back to the new contribution form with errors" do
        subject
        expect(response).to redirect_to(my_new_contribution_url)
        follow_redirect!
        expect(inertia.props[:errors]["osbls_causes"]).to be_present
      end
    end
  end

  describe "DELETE /destroy" do
    let(:user) { create(:user) }
    let!(:contribution) { create(:contribution, user: user, status: "brouillon") }
    subject { delete user_contribution_url(user, contribution) }

    it_behaves_like "require_authentication"

    context "signed as another user" do
      let(:other_user) { create(:user) }

      before do
        sign_in_as(other_user)
      end

      it_behaves_like "only_for_current_user"
    end

    context "for current user" do
      before do
        sign_in_as(user)
      end

      context "when contribution is a draft" do
        it "destroys the contribution" do
          expect { subject }.to change(Contribution, :count).by(-1)
        end

        it "redirects to contributions list with success message" do
          subject
          expect(response).to redirect_to(my_contributions_url)
          expect(flash[:success]).to be_present
        end
      end

      context "when contribution is not a draft" do
        let!(:contribution) { create(:contribution, user: user, status: "published") }

        it "raises an ActiveRecord::RecordNotFound error" do
          expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end
  end
end
