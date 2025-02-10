require "rails_helper"

RSpec.describe ContributionSerializer do
  describe "#as_json" do
    subject { described_class.new(contribution).as_json }

    context "when contributable_type is OsblCreation" do
      let(:contribution) do
        build(:contribution, :osbl_creation,
          id: 1,
          created_at: Time.current,
          status: "pending",
          github_resource_url: "http://example.com")
      end

      it 'returns type_label with "Ajouter"' do
        expect(subject[:type_label]).to eq("Ajouter OSBL Created")
      end
    end

    context "when contributable_type is OsblUpdate" do
      let(:contribution) do
        build(:contribution, :osbl_update,
          id: 1,
          created_at: Time.current,
          status: "pending",
          github_resource_url: "http://example.com")
      end

      it 'returns type_label with "Modifier"' do
        expect(subject[:type_label]).to eq("Modifier OSBL Updated")
      end
    end

    context "when contributable_type is Feedback" do
      let(:contribution) do
        build(:contribution, :feedback,
          id: 1,
          created_at: Time.current,
          status: "pending",
          github_resource_url: "http://example.com")
      end

      it "returns type_label for Feedback" do
        expect(subject[:type_label]).to eq("Retour d'expérience")
      end
    end

    context "when contributable_type is FeatureRequest" do
      let(:contribution) do
        build(:contribution, :feature_request,
          id: 1,
          created_at: Time.current,
          status: "pending",
          github_resource_url: "http://example.com")
      end

      it "returns type_label for FeatureRequest" do
        expect(subject[:type_label]).to eq("Suggestion")
      end
    end

    context "when contributable_type is BugReport" do
      let(:contribution) do
        build(:contribution, :bug_report,
          id: 1,
          created_at: Time.current,
          status: "pending",
          github_resource_url: "http://example.com")
      end

      it "returns type_label for BugReport" do
        expect(subject[:type_label]).to eq("Rapport de bogue")
      end
    end

    context "when contributable_type is CorrectionRequest" do
      let(:contribution) do
        build(:contribution, :correction_request,
          id: 1,
          created_at: Time.current,
          status: "pending",
          github_resource_url: "http://example.com")
      end

      it "returns type_label for CorrectionRequest" do
        expect(subject[:type_label]).to eq("Correctif")
      end
    end

    context "when contributable_type is Other" do
      let(:contribution) do
        build(:contribution, :other,
          id: 1,
          created_at: Time.current,
          status: "pending",
          github_resource_url: "http://example.com")
      end

      it "returns type_label for Other" do
        expect(subject[:type_label]).to eq("Autre")
      end
    end

    context "when contributable_type is unknown" do
      let(:contribution) do
        build(:contribution,
          id: 1,
          created_at: Time.current,
          status: "pending",
          github_resource_url: "http://example.com")
      end

      before do
        allow(contribution).to receive(:contributable_type).and_return("UnknownType")
      end

      it "returns an empty type_label" do
        expect(subject[:type_label]).to eq("")
      end
    end
  end
end
