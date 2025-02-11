require "rails_helper"

RSpec.describe Osbl::Keyword, type: :model do
  describe "factory" do
    it "is valid" do
      expect(create(:keyword)).to be_valid
    end
  end

  describe "database constraints" do
    # Test name presence constraint
    it "raises error when name is null" do
      expect {
        Osbl::Keyword.create!(name: nil)
      }.to raise_error(ActiveRecord::NotNullViolation)
    end

    # Test name uniqueness constraint
    it "raises error on duplicate name" do
      Osbl::Keyword.create!(name: "Technology")
      expect {
        Osbl::Keyword.create!(name: "Technology")
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    # Test name length constraints
    it "raises error when name is shorter than 3 characters" do
      expect {
        Osbl::Keyword.create!(name: "ab")
      }.to raise_error(ActiveRecord::StatementInvalid, /keywords_name_length_check/)
    end

    it "raises error when name is longer than 100 characters" do
      expect {
        Osbl::Keyword.create!(name: "a" * 101)
      }.to raise_error(ActiveRecord::StatementInvalid, /keywords_name_length_check/)
    end
  end

  describe "associations" do
    it "cascades deletion of osbls_keywords when deleted" do
      keyword = Osbl::Keyword.create!(name: "Technology")
      osbl = create(:osbl)
      keyword.osbls << osbl

      expect { keyword.destroy }.to change { JoinTables::OsblsKeyword.count }.by(-1)
    end
  end

  describe "normalization" do
    it "normalizes the name" do
      keyword = Osbl::Keyword.create!(name: "  TECHNOLOGY LoL YoLo  ")
      expect(keyword.name).to eq("Technology lol yolo")
    end
  end
end
