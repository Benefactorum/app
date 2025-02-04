require "rails_helper"

RSpec.describe FundAllocation, type: :model do
  let(:annual_finance) { create(:annual_finance) }

  describe "factory" do
    it "is valid" do
      expect(create(:fund_allocation)).to be_valid
    end
  end

  describe "database constraints" do
    describe "percent constraints" do
      it "enforces percent > 0" do
        fund_allocation = build(:fund_allocation, annual_finance: annual_finance, percent: 0)
        expect { fund_allocation.save }.to raise_error(ActiveRecord::StatementInvalid, /percent_within_range/)
      end

      it "enforces percent <= 100" do
        fund_allocation = build(:fund_allocation, annual_finance: annual_finance, percent: 101)
        expect { fund_allocation.save }.to raise_error(ActiveRecord::StatementInvalid, /percent_within_range/)
      end
    end

    describe "amount constraints" do
      it "enforces amount > 0" do
        fund_allocation = build(:fund_allocation, annual_finance: annual_finance, amount: 0)
        expect { fund_allocation.save }.to raise_error(ActiveRecord::StatementInvalid, /amount_positive/)
      end
    end

    describe "uniqueness constraints" do
      it "enforces unique annual_finance_id and type combination" do
        create(:fund_allocation, annual_finance: annual_finance, type: "Missions sociales")
        duplicate = build(:fund_allocation, annual_finance: annual_finance, type: "Missions sociales")

        expect { duplicate.save }.to raise_error(ActiveRecord::RecordNotUnique)
      end
    end
  end
end
