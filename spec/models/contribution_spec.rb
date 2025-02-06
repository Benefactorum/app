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
  end
end
