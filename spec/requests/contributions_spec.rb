require "rails_helper"

RSpec.describe "/contributions", type: :request, inertia: true do
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
      creation_year: "2023",
      document_attachments_attributes: {
        "0" => {
          document_attributes: {
            type: "Statuts",
            file: document_file,
            name: "Statuts de l'association",
            year: "2023"
          }
        },
        "1" => {
          document_attributes: {
            type: "Statuts",
            file: document_file,
            name: "Statuts du fonds de dotation",
            year: "2023"
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
  end

  let(:invalid_attributes) do
    {
      name: "OSBL 1"
      # missing required osbls_causes_attributes
    }
  end

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
          .and change(ActiveStorage::Blob, :count).by(3)

        contribution = Contribution.last
        osbl_data = contribution.contributable.osbl_data
        osbl = Osbl.create!(osbl_data)

        expect(osbl.logo).to be_attached
        expect(osbl.document_attachments.first.document.file).to be_attached
        expect(osbl.document_attachments.second.document.file).to be_attached
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
end
