require "rails_helper"

RSpec.describe Address, type: :model do
  describe "factory" do
    it "is valid" do
      expect(create(:address)).to be_valid
    end
  end

  describe "database constraints" do
    it "raises error when latitude is less than -90" do
      expect {
        create(:address, latitude: -91)
      }.to raise_error(ActiveRecord::StatementInvalid, /check_latitude_range/)
    end

    it "raises error when latitude is greater than 90" do
      expect {
        create(:address, latitude: 91)
      }.to raise_error(ActiveRecord::StatementInvalid, /check_latitude_range/)
    end

    it "raises error when longitude is less than -180" do
      expect {
        create(:address, longitude: -181)
      }.to raise_error(ActiveRecord::StatementInvalid, /check_longitude_range/)
    end

    it "raises error when longitude is greater than 180" do
      expect {
        create(:address, longitude: 181)
      }.to raise_error(ActiveRecord::StatementInvalid, /check_longitude_range/)
    end

    it "enforces unique addressable per record" do
      first_address = create(:address)

      expect {
        create(:address, addressable: first_address.addressable)
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end
end
