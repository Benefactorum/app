require "rails_helper"

RSpec.describe FrenchAddressApi do
  describe ".search" do
    it "returns parsed response for valid address query" do
      VCR.use_cassette("french_address/valid_search") do
        result = described_class.search("12 rue du moulin 44260 La Chapelle-Launay")

        first_matching_address = result["features"].first
        expect(first_matching_address["properties"]["score"]).to be_between(0.9, 1.0)
        expect(first_matching_address["properties"]["housenumber"]).to eq("12")
        expect(first_matching_address["properties"]["street"]).to eq("Rue du moulin")
        expect(first_matching_address["properties"]["postcode"]).to eq("44260")
        expect(first_matching_address["properties"]["city"]).to eq("La Chapelle-Launay")
        expect(first_matching_address["geometry"]["coordinates"]).to eq([-1.969269, 47.371354])
      end
    end
  end
end
