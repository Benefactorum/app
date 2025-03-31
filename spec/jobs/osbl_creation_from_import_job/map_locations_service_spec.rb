require "rails_helper"

RSpec.describe OsblCreationFromImportJob::MapLocationsService do
  describe ".call" do
    context "with blank locations" do
      it "returns nil" do
        result = described_class.call(nil)
        expect(result).to be_nil

        result = described_class.call([])
        expect(result).to be_nil
      end
    end

    context "with valid locations" do
      let(:locations) do
        [
          {
            "type" => "headquarters",
            "address_attributes" => {
              "street_number" => "123",
              "street_name" => "Main Street",
              "postal_code" => "75001",
              "city" => "Paris"
            }
          }
        ]
      end

      let(:api_response) do
        {
          "features" => [
            {
              "properties" => {
                "score" => 0.95,
                "housenumber" => "123",
                "street" => "Main Street",
                "postcode" => "75001",
                "city" => "Paris"
              },
              "geometry" => {
                "coordinates" => [2.3522, 48.8566]
              }
            }
          ]
        }
      end

      before do
        allow(FrenchAddressApi).to receive(:search).and_return(api_response)
      end

      it "processes the locations correctly" do
        result = described_class.call(locations)

        expect(result.size).to eq(1)
        expect(result.first["type"]).to eq("headquarters")

        address = result.first["address_attributes"]
        expect(address["street_number"]).to eq("123")
        expect(address["street_name"]).to eq("Main Street")
        expect(address["postal_code"]).to eq("75001")
        expect(address["city"]).to eq("Paris")
        expect(address["latitude"]).to eq(48.8566)
        expect(address["longitude"]).to eq(2.3522)
      end
    end

    context "with duplicate addresses" do
      let(:locations) do
        [
          {
            "type" => "headquarters",
            "address_attributes" => {
              "street_number" => "123",
              "street_name" => "Main Street",
              "postal_code" => "75001",
              "city" => "Paris"
            }
          },
          {
            "type" => "branch",
            "address_attributes" => {
              "street_number" => "123",
              "street_name" => "Main Street",
              "postal_code" => "75001",
              "city" => "Paris"
            }
          }
        ]
      end

      let(:api_response) do
        {
          "features" => [
            {
              "properties" => {
                "score" => 0.95,
                "housenumber" => "123",
                "street" => "Main Street",
                "postcode" => "75001",
                "city" => "Paris"
              },
              "geometry" => {
                "coordinates" => [2.3522, 48.8566]
              }
            }
          ]
        }
      end

      before do
        allow(FrenchAddressApi).to receive(:search).and_return(api_response)
      end

      it "excludes duplicate addresses" do
        result = described_class.call(locations)
        expect(result.size).to eq(1)
        expect(result.first["type"]).to eq("headquarters")
      end
    end

    context "with invalid addresses" do
      let(:locations) do
        [
          {
            "type" => "headquarters",
            "address_attributes" => {
              "street_number" => "123",
              "street_name" => "Main Street",
              "postal_code" => "75001",
              "city" => "Paris"
            }
          }
        ]
      end

      let(:api_response) do
        {
          "features" => [
            {
              "properties" => {
                "score" => 0.85, # Low confidence score
                "housenumber" => "123",
                "street" => "Main Street",
                "postcode" => "75001",
                "city" => "Paris"
              },
              "geometry" => {
                "coordinates" => [2.3522, 48.8566]
              }
            }
          ]
        }
      end

      before do
        allow(FrenchAddressApi).to receive(:search).and_return(api_response)
      end

      it "excludes addresses with low confidence" do
        result = described_class.call(locations)
        expect(result).to be_empty
      end
    end

    context "with API errors" do
      let(:locations) do
        [
          {
            "type" => "headquarters",
            "address_attributes" => {
              "street_number" => "123",
              "street_name" => "Main Street",
              "postal_code" => "75001",
              "city" => "Paris"
            }
          }
        ]
      end

      let(:api_response) do
        {
          "features" => [
            {
              "properties" => {
                "score" => 0.95,
                "housenumber" => "123",
                "street" => "Main Street",
                "postcode" => "75001",
                "city" => "Paris"
              },
              "geometry" => {
                "coordinates" => [2.3522, 48.8566]
              }
            }
          ]
        }
      end

      context "when API call fails but succeeds after retry" do
        before do
          call_count = 0
          allow(FrenchAddressApi).to receive(:search) do
            call_count += 1
            if call_count == 1
              raise FrenchAddressApi::ApiError
            else
              api_response
            end
          end
        end

        it "retries and succeeds" do
          result = described_class.call(locations)
          expect(result.size).to eq(1)
          expect(FrenchAddressApi).to have_received(:search).twice
        end
      end

      context "when API call fails repeatedly" do
        before do
          allow(FrenchAddressApi).to receive(:search).and_raise(FrenchAddressApi::ApiError)
          allow(Rails.logger).to receive(:error)
        end

        it "gives up after maximum retries" do
          result = described_class.call(locations)
          expect(result).to be_empty
          expect(FrenchAddressApi).to have_received(:search).exactly(3).times
          expect(Rails.logger).to have_received(:error).with("Failed to get confirmed address after retries")
        end
      end
    end
  end
end
