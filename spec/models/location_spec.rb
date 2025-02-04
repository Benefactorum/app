require "rails_helper"

RSpec.describe Location, type: :model do
  describe "factory" do
    it "is valid" do
      expect(create(:location)).to be_valid
    end
  end

  describe "database constraints" do
    it "raises error when type is null" do
      expect {
        Location.create!(type: nil, osbl: create(:osbl), address_attributes: attributes_for(:address))
      }.to raise_error(ActiveRecord::NotNullViolation)
    end

    it "raises error when name is null for antenne_locale type" do
      expect {
        Location.create!(
          type: :antenne_locale,
          name: nil,
          osbl: create(:osbl),
          address_attributes: attributes_for(:address)
        )
      }.to raise_error(ActiveRecord::StatementInvalid, /name_required_for_specific_types/)
    end

    it "raises error when name is null for lieu_d_activite type" do
      expect {
        Location.create!(
          type: :lieu_d_activite,
          name: nil,
          osbl: create(:osbl),
          address_attributes: attributes_for(:address)
        )
      }.to raise_error(ActiveRecord::StatementInvalid, /name_required_for_specific_types/)
    end

    it "raises error when name is null for autre type" do
      expect {
        Location.create!(
          type: :autre,
          name: nil,
          osbl: create(:osbl),
          address_attributes: attributes_for(:address)
        )
      }.to raise_error(ActiveRecord::StatementInvalid, /name_required_for_specific_types/)
    end

    it "enforces unique siege_social per osbl" do
      osbl = create(:osbl)
      create(:location, type: :siege_social, osbl: osbl)

      expect {
        create(:location, type: :siege_social, osbl: osbl)
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end

  describe "associations" do
    it "destroys address when location is destroyed" do
      location = create(:location)
      address = location.address
      expect { location.destroy }.to change(Address, :count).by(-1)
      expect(address).to be_destroyed
    end
  end

  describe "validations" do
    subject(:location) { build(:location) }

    it "is invalid without an address" do
      location.address = nil
      expect(location).not_to be_valid
      expect(location.errors[:address]).to be_present
    end
  end
end
