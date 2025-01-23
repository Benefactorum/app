require "rails_helper"

RSpec.describe AnnualFinance, type: :model do
  describe "validations" do
    let(:osbl) { create(:osbl) }
    subject(:annual_finance) { build(:annual_finance, osbl: osbl) }

    context "when only year is present" do
      before do
        annual_finance.attributes = {
          year: Time.current.year,
          employees_count: nil
        }
      end

      it "is invalid" do
        expect(annual_finance).not_to be_valid
        expect(annual_finance.errors[:base]).to include("Au moins une information est requise en plus de l'année.")
      end

      context "but has fund sources" do
        before do
          annual_finance.fund_sources.build(
            percent: 100,
            type: "dons"
          )
        end

        it "is valid" do
          expect(annual_finance).to be_valid
        end
      end
    end

    context "when year and another attribute are present" do
      before do
        annual_finance.attributes = {
          year: Time.current.year,
          employees_count: 5
        }
      end

      it "is valid" do
        expect(annual_finance).to be_valid
      end
    end
  end
end
