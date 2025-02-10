require "rails_helper"

RSpec.describe Osbl::InterventionArea, type: :model do
  describe "factory" do
    it "is valid" do
      expect(create(:intervention_area)).to be_valid
    end
  end

  describe "database constraints" do
    # Test name presence constraint
    it "raises error when name is null" do
      expect {
        Osbl::InterventionArea.create!(name: nil)
      }.to raise_error(ActiveRecord::NotNullViolation)
    end

    # Test name uniqueness constraint
    it "raises error on duplicate name" do
      Osbl::InterventionArea.create!(name: "Asia")
      expect {
        Osbl::InterventionArea.create!(name: "Asia")
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    # Test name length constraints
    it "raises error when name is shorter than 3 characters" do
      expect {
        Osbl::InterventionArea.create!(name: "ab")
      }.to raise_error(ActiveRecord::StatementInvalid, /intervention_areas_name_length_check/)
    end

    it "raises error when name is longer than 100 characters" do
      expect {
        Osbl::InterventionArea.create!(name: "a" * 101)
      }.to raise_error(ActiveRecord::StatementInvalid, /intervention_areas_name_length_check/)
    end
  end

  describe "associations" do
    it "cascades deletion of osbls_intervention_areas when deleted" do
      intervention_area = Osbl::InterventionArea.create!(name: "Asia")
      osbl = create(:osbl)
      intervention_area.osbls << osbl

      expect { intervention_area.destroy }.to change { Osbl::InterventionArea.count }.by(-1)
    end
  end

  describe "normalization" do
    it "normalizes the name" do
      intervention_area = Osbl::InterventionArea.create!(name: "  ASIA LoL YoLo  ")
      expect(intervention_area.name).to eq("Asia lol yolo")
    end
  end
end
