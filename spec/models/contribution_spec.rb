require "rails_helper"

RSpec.describe Contribution, type: :model do
  describe "factory" do
    it "is valid" do
      expect(build(:contribution)).to be_valid
    end

    describe "osbl_creation" do
      it "is valid" do
        expect(build(:contribution, :osbl_creation)).to be_valid
      end
    end
  end

  describe "db_constraints" do
    xcontext "when contributable_type requires body" do
      %i[feedback feature_request bug_report correction_request other].each do |type|
        it "enforces body presence for #{type}" do
          contribution = build(:contribution, contributable: build(type, body: nil))
          expect { contribution.save }.to raise_error(ActiveRecord::StatementInvalid)
        end

        it "allows saving #{type} with body present" do
          contribution = build(:contribution, contributable: build(type, body: "Some content"))
          expect { contribution.save }.not_to raise_error
        end
      end
    end

    context "when contributable_type does not require body" do
      # %i[osbl_creation osbl_update].each do |type|
      %i[osbl_creation].each do |type|
        it "allows nil body for #{type}" do
          contribution = build(:contribution, contributable: build(type))
          expect { contribution.save }.not_to raise_error
        end
      end
    end
  end

  describe "#type_label" do
    context "when contributable type is OsblCreation" do
      it "returns the correct label with name" do
        contribution = build(:contribution, :osbl_creation)
        contribution.contributable.osbl_data = {"name" => "Awesome Osbl"}
        expect(contribution.type_label).to eq("Ajouter Awesome Osbl")
      end
    end

    context "when contributable type is OsblUpdate" do
      it "returns the correct label with name" do
        contribution = build(:contribution, :osbl_update)
        contribution.contributable.osbl_data = {"name" => "Updated Osbl"}
        expect(contribution.type_label).to eq("Modifier Updated Osbl")
      end
    end

    context "when contributable type is Feedback" do
      it "returns Feedback" do
        contribution = build(:contribution, :feedback)
        expect(contribution.type_label).to eq("Retour d'expérience")
      end
    end

    context "when contributable type is FeatureRequest" do
      it "returns Suggestion" do
        contribution = build(:contribution, :feature_request)
        expect(contribution.type_label).to eq("Suggestion")
      end
    end

    context "when contributable type is BugReport" do
      it "returns Rapport de bogue" do
        contribution = build(:contribution, :bug_report)
        expect(contribution.type_label).to eq("Rapport de bogue")
      end
    end

    context "when contributable type is CorrectionRequest" do
      it "returns Correctif" do
        contribution = build(:contribution, :correction_request)
        expect(contribution.type_label).to eq("Correctif")
      end
    end

    context "when contributable type is Other" do
      it "returns Autre" do
        contribution = build(:contribution, :other)
        expect(contribution.type_label).to eq("Autre")
      end
    end
  end

  describe "file attachments" do
    it "is invalid when file size exceeds 5MB" do
      contribution = build(:contribution)
      allow_any_instance_of(ActiveStorage::Blob).to receive(:byte_size).and_return(6.megabytes)

      contribution.files.attach(
        io: StringIO.new,
        filename: "large_file.txt",
        content_type: "text/plain"
      )

      expect(contribution).not_to be_valid
      expect(contribution.errors[:files]).to be_present
    end

    it "is valid when file size is under 5MB" do
      contribution = build(:contribution)
      allow_any_instance_of(ActiveStorage::Blob).to receive(:byte_size).and_return(1.megabyte)

      contribution.files.attach(
        io: StringIO.new,
        filename: "small_file.txt",
        content_type: "text/plain"
      )

      expect(contribution).to be_valid
    end

    it "is invalid when more than 5 files are attached" do
      contribution = build(:contribution)

      6.times do |i|
        contribution.files.attach(
          io: StringIO.new,
          filename: "file_#{i}.txt",
          content_type: "text/plain"
        )
      end

      expect(contribution).not_to be_valid
      expect(contribution.errors[:files]).to be_present
    end

    it "is valid when exactly 5 files are attached" do
      contribution = build(:contribution)

      5.times do |i|
        contribution.files.attach(
          io: StringIO.new,
          filename: "file_#{i}.txt",
          content_type: "text/plain"
        )
      end

      expect(contribution).to be_valid
    end
  end
end
