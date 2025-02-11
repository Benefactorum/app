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
    context "when contributable_type requires body" do
      %i[feedback feature_request bug_report correction_request other].each do |type|
        it "enforces body presence for #{type}" do
          contribution = build(:contribution, body: nil, contributable: build(type))
          expect { contribution.save! }.to raise_error(ActiveRecord::StatementInvalid)
        end

        it "allows saving #{type} with body present" do
          contribution = build(:contribution, type)
          expect { contribution.save! }.not_to raise_error
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

  describe "scopes" do
    let(:user) { create(:user) }
    let!(:osbl_creation) { create(:contribution, :osbl_creation, user: user) }
    let!(:osbl_update) { create(:contribution, :osbl_update, user: user) }
    let!(:other_contribution) { create(:contribution, :feedback, user: user) }

    describe ".with_osbl_data" do
      # Helper method to count SELECT queries
      def count_select_queries(&block)
        queries = []
        callback = ->(_name, _start, _finish, _id, payload) do
          sql = payload[:sql]
          # Exclude schema queries
          queries << sql if sql =~ /^\s*SELECT/i && !sql.include?("SCHEMA")
        end
        ActiveSupport::Notifications.subscribed(callback, "sql.active_record", &block)
        queries.size
      end

      it "loads osbl_data for all contributions in a single query" do
        # Clear any existing query cache
        ActiveRecord::Base.connection.clear_query_cache

        query_count = count_select_queries { described_class.with_osbl_data.load }
        expect(query_count).to eq(1)

        contributions = described_class.with_osbl_data.load
        additional_query_count = count_select_queries do
          contributions.each { |contribution| contribution.osbl_data }
        end
        expect(additional_query_count).to eq(0)
      end

      it "includes the correct osbl_data for each contribution type" do
        contributions = described_class.with_osbl_data.order(:id)

        # OSBL Creation
        creation = contributions.find { |c| c.contributable_type == "Contribution::OsblCreation" }
        expect(creation.osbl_data).to include(
          "name" => "OSBL Created",
          "tax_reduction" => "intérêt_général"
        )

        # OSBL Update
        update = contributions.find { |c| c.contributable_type == "Contribution::OsblUpdate" }
        expect(update.osbl_data).to include(
          "name" => "OSBL Updated",
          "tax_reduction" => "aide_aux_personnes_en_difficulté"
        )

        # Other contribution types should have nil osbl_data
        feedback = contributions.find { |c| c.contributable_type == "Contribution::Feedback" }
        expect(feedback.osbl_data).to be_nil
      end

      it "allows filtering by osbl_data content" do
        filtered_contributions = described_class.with_osbl_data
          .where("json_extract(COALESCE(contribution_osbl_creations.osbl_data, contribution_osbl_updates.osbl_data), '$.name') LIKE ?", "%Created%")

        expect(filtered_contributions).to include(osbl_creation)
        expect(filtered_contributions).not_to include(osbl_update)
        expect(filtered_contributions).not_to include(other_contribution)
      end
    end
  end
end
