require "rails_helper"

RSpec.describe Contributions::CreateService do
  let(:user) { create(:user) }
  let(:cause) { create(:cause) }
  let(:valid_params) do
    {
      "body" => "New contribution",
      "files" => [],
      "osbl" => {
        "name" => "New OSBL",
        "tax_reduction" => "intérêt_général",
        "osbls_causes_attributes" => [{cause_id: cause.id}]
      }
    }
  end

  describe "#call" do
    context "with valid params" do
      it "creates a new contribution" do
        service = described_class.new(user: user, params: valid_params)

        expect {
          status, _ = service.call

          expect(status).to eq(:ok)
        }.to change(Contribution, :count).by(1)

        contribution = Contribution.last
        expect(contribution.user).to eq(user)
        expect(contribution.body).to eq("New contribution")
        expect(contribution.osbl_data).to include(
          "name" => "New OSBL",
          "tax_reduction" => "intérêt_général"
        )
        expect(contribution.osbl_data["osbls_causes_attributes"].first)
          .to include("cause_id" => cause.id)
      end
    end

    context "with invalid osbl data" do
      let(:invalid_params) do
        valid_params.merge("osbl" => {"name" => ""})
      end

      it "returns error status with validation errors" do
        service = described_class.new(user: user, params: invalid_params)

        expect {
          status, errors = service.call

          expect(status).to eq(:error)
          expect(errors).to be_present
        }.not_to change(Contribution, :count)
      end
    end
  end
end
