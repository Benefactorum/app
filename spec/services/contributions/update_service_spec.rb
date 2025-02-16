require "rails_helper"

RSpec.describe Contributions::UpdateService do
  let(:contribution) { create(:contribution) }
  let(:valid_params) do
    {
      body: "Updated body",
      files: [],
      osbl: {
        name: "Updated OSBL",
        tax_reduction: "intérêt_général",
        osbls_causes_attributes: [{cause_id: create(:cause).id}]
      }
    }
  end

  describe "#call" do
    context "with valid params" do
      it "updates the contribution" do
        service = described_class.new(contribution: contribution, params: valid_params)
        status, message = service.call

        expect(status).to eq(:ok)
        expect(message).to eq("Votre contribution a été modifiée.")
        expect(contribution.reload.body).to eq("Updated body")
      end
    end

    context "with invalid osbl data" do
      let(:invalid_params) do
        valid_params.merge(osbl: {name: ""}) # Invalid OSBL data
      end

      it "returns error status with validation errors" do
        service = described_class.new(contribution: contribution, params: invalid_params)
        status, errors = service.call

        expect(status).to eq(:error)
        expect(errors).to be_present
      end
    end
  end
end
