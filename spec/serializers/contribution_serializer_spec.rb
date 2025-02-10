require "rails_helper"

RSpec.describe ContributionSerializer do
  describe "#as_json" do
    let(:attributes) do
      {
        id: 1,
        created_at: Time.current,
        status: "pending",
        github_resource_url: "http://example.com"
      }
    end

    subject { described_class.new(contribution).as_json }

    context "when contributable_type is OsblCreation" do
      let(:contribution) do
        double("Contribution", attributes.merge(
          contributable_type: "OsblCreation",
          contributable: double("Contributions::OsblCreation", osbl_data: {"name" => "Benefactorum"})
        ))
      end

      it 'returns type_label with "Ajouter"' do
        expect(subject[:type_label]).to eq("Ajouter Benefactorum")
      end
    end

    context "when contributable_type is OsblUpdate" do
      let(:contribution) do
        double("Contribution", attributes.merge(
          contributable_type: "OsblUpdate",
          contributable: double("Contributions::OsblUpdate", osbl_data: {"name" => "Benefactorum"})
        ))
      end

      it 'returns type_label with "Modifier"' do
        expect(subject[:type_label]).to eq("Modifier Benefactorum")
      end
    end

    context "when contributable_type is Feedback" do
      let(:contribution) do
        double("Contribution", attributes.merge(
          contributable_type: "Feedback",
          contributable: double("Contributions::Feedback")
        ))
      end

      it "returns type_label for Feedback" do
        expect(subject[:type_label]).to eq("Retour d'expérience")
      end
    end

    context "when contributable_type is FeatureRequest" do
      let(:contribution) do
        double("Contribution", attributes.merge(
          contributable_type: "FeatureRequest",
          contributable: double("Contributions::FeatureRequest")
        ))
      end

      it "returns type_label for FeatureRequest" do
        expect(subject[:type_label]).to eq("Suggestion")
      end
    end

    context "when contributable_type is BugReport" do
      let(:contribution) do
        double("Contribution", attributes.merge(
          contributable_type: "BugReport",
          contributable: double("Contributions::BugReport")
        ))
      end

      it "returns type_label for BugReport" do
        expect(subject[:type_label]).to eq("Rapport de bogue")
      end
    end

    context "when contributable_type is CorrectionRequest" do
      let(:contribution) do
        double("Contribution", attributes.merge(
          contributable_type: "CorrectionRequest",
          contributable: double("Contributions::CorrectionRequest")
        ))
      end

      it "returns type_label for CorrectionRequest" do
        expect(subject[:type_label]).to eq("Correctif")
      end
    end

    context "when contributable_type is Other" do
      let(:contribution) do
        double("Contribution", attributes.merge(
          contributable_type: "Other",
          contributable: double("Contributions::Other")
        ))
      end

      it "returns type_label for Other" do
        expect(subject[:type_label]).to eq("Autre")
      end
    end

    context "when contributable_type is unknown" do
      let(:contribution) do
        double("Contribution", attributes.merge(
          contributable_type: "UnknownType",
          contributable: double("UnknownType")
        ))
      end

      it "returns an empty type_label" do
        expect(subject[:type_label]).to eq("")
      end
    end
  end
end
