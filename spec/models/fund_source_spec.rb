require "rails_helper"

RSpec.describe Osbl::FundSource, type: :model do
  let(:annual_finance) { create(:annual_finance) }

  describe "database constraints" do
    describe "percent constraints" do
      it "enforces percent > 0" do
        fund_source = build(:fund_source, annual_finance: annual_finance, percent: 0)
        expect(fund_source).not_to be_valid
        expect { fund_source.save!(validate: false) }.to raise_error(ActiveRecord::StatementInvalid, /percent_within_range/)
      end

      it "enforces percent <= 100" do
        fund_source = build(:fund_source, annual_finance: annual_finance, percent: 101)
        expect(fund_source).not_to be_valid
        expect { fund_source.save!(validate: false) }.to raise_error(ActiveRecord::StatementInvalid, /percent_within_range/)
      end
    end

    describe "amount constraints" do
      it "enforces amount > 0" do
        fund_source = build(:fund_source, annual_finance: annual_finance, amount: 0)
        expect(fund_source).not_to be_valid
        expect { fund_source.save!(validate: false) }.to raise_error(ActiveRecord::StatementInvalid, /amount_positive/)
      end
    end

    describe "uniqueness constraints" do
      it "enforces unique annual_finance_id and type combination" do
        create(:fund_source, annual_finance: annual_finance, type: "Dons")
        duplicate = build(:fund_source, annual_finance: annual_finance, type: "Dons")

        expect(duplicate).not_to be_valid
        expect { duplicate.save!(validate: false) }.to raise_error(ActiveRecord::RecordNotUnique)
      end
    end
  end
end
