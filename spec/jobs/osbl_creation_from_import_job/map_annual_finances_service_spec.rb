require "rails_helper"

RSpec.describe OsblCreationFromImportJob::MapAnnualFinancesService do
  describe ".call" do
    context "with blank annual finances" do
      it "returns an empty array" do
        result = described_class.call(nil)
        expect(result).to eq(nil)

        result = described_class.call([])
        expect(result).to eq(nil)
      end
    end

    context "with valid annual finances" do
      let(:annual_finances) do
        [
          {
            "year" => "2022",
            "budget" => "100000",
            "treasury" => "50000",
            "certified" => true,
            "employees_count" => "5",
            "fund_sources_attributes" => [
              {"type" => "public", "amount" => "60000", "percent" => "60"},
              {"type" => "private", "amount" => "40000", "percent" => "40"}
            ],
            "fund_allocations_attributes" => [
              {"type" => "salaries", "amount" => "70000", "percent" => "70"},
              {"type" => "operations", "amount" => "30000", "percent" => "30"}
            ]
          }
        ]
      end

      it "processes the annual finances correctly" do
        result = described_class.call(annual_finances)

        expect(result.size).to eq(1)
        expect(result.first["year"]).to eq("2022")
        expect(result.first["budget"]).to eq("100000")
        expect(result.first["treasury"]).to eq("50000")
        expect(result.first["certified"]).to eq(true)
        expect(result.first["employees_count"]).to eq("5")

        # Check fund sources
        expect(result.first["fund_sources_attributes"].size).to eq(2)
        expect(result.first["fund_sources_attributes"].pluck("type")).to contain_exactly("public", "private")

        # Check fund allocations
        expect(result.first["fund_allocations_attributes"].size).to eq(2)
        expect(result.first["fund_allocations_attributes"].pluck("type")).to contain_exactly("salaries", "operations")
      end
    end

    context "with duplicate entries for the same year" do
      let(:annual_finances) do
        [
          {
            "year" => "2022",
            "budget" => "100000",
            "treasury" => nil,
            "certified" => nil,
            "employees_count" => nil,
            "fund_sources_attributes" => []
          },
          {
            "year" => "2022",
            "budget" => "100000",
            "treasury" => "50000",
            "certified" => true,
            "employees_count" => "5",
            "fund_sources_attributes" => [
              {"type" => "public", "amount" => "60000", "percent" => "60"},
              {"type" => "private", "amount" => "40000", "percent" => "40"}
            ],
            "fund_allocations_attributes" => [
              {"type" => "salaries", "amount" => "70000", "percent" => "70"},
              {"type" => "operations", "amount" => "30000", "percent" => "30"}
            ]
          }
        ]
      end

      it "selects the most complete entry for each year" do
        result = described_class.call(annual_finances)

        expect(result.size).to eq(1)
        expect(result.first["year"]).to eq("2022")
        expect(result.first["treasury"]).to eq("50000")
        expect(result.first["certified"]).to eq(true)
        expect(result.first["employees_count"]).to eq("5")
        expect(result.first["fund_sources_attributes"]).to be_present
        expect(result.first["fund_allocations_attributes"]).to be_present
      end
    end

    context "with invalid fund sources or allocations" do
      let(:annual_finances) do
        [
          {
            "year" => "2022",
            "budget" => "100000",
            "treasury" => "50000",
            "certified" => true,
            "employees_count" => "5",
            "fund_sources_attributes" => [
              {"type" => "public", "amount" => "60000", "percent" => "60"},
              {"type" => "private", "amount" => "30000", "percent" => "30"}
            ],
            "fund_allocations_attributes" => [
              {"type" => "salaries", "amount" => "70000", "percent" => "70"},
              {"type" => "operations", "amount" => "30000", "percent" => "30"}
            ]
          }
        ]
      end

      it "excludes fund sources that don't add up to 100%" do
        result = described_class.call(annual_finances)

        expect(result.size).to eq(1)
        expect(result.first["fund_sources_attributes"]).to be_nil
        expect(result.first["fund_allocations_attributes"]).to be_present
      end
    end

    context "with entries that have no data except year" do
      let(:annual_finances) do
        [
          {
            "year" => "2022",
            "budget" => nil,
            "treasury" => nil,
            "certified" => nil,
            "employees_count" => nil,
            "fund_sources_attributes" => [],
            "fund_allocations_attributes" => []
          }
        ]
      end

      it "excludes entries with only year data" do
        result = described_class.call(annual_finances)
        expect(result).to eq([])
      end
    end
  end
end
