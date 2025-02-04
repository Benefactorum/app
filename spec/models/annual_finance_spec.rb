require "rails_helper"

RSpec.describe AnnualFinance, type: :model do
  describe "factory" do
    it "has a valid factory" do
      expect(build(:annual_finance)).to be_valid
    end
  end

  describe "validations" do
    let(:osbl) { create(:osbl) }
    subject(:annual_finance) { build(:annual_finance, osbl: osbl) }

    describe "year validation" do
      it "is invalid with a future year" do
        annual_finance.year = Time.current.year + 1
        expect(annual_finance).not_to be_valid
        expect(annual_finance.errors[:year]).to be_present
      end
    end

    context "#at_least_one_information" do
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
              type: "Dons"
            )
          end

          it "is valid" do
            expect(annual_finance).to be_valid
          end
        end

        context "but has fund allocations" do
          before do
            annual_finance.fund_allocations.build(
              percent: 100,
              type: "Missions sociales"
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

    context "#fund_sources_total_percentage_is_100" do
      context "when creating fund sources" do
        it "allows creating 1 fund_source with 100%" do
          annual_finance.fund_sources.build(
            percent: 100,
            type: "Dons"
          )
          expect {
            annual_finance.save!
          }.not_to raise_error
        end

        it "allows creating several fund_sources with 100%" do
          annual_finance.fund_sources.build(
            percent: 49.9,
            type: "Dons"
          )
          annual_finance.fund_sources.build(
            percent: 50.1,
            type: "Aides publiques"
          )
          expect {
            annual_finance.save!
          }.not_to raise_error
        end

        it "prevents creating sources that exceed 100%" do
          annual_finance.fund_sources.build(
            percent: 50.1,
            type: "Dons"
          )
          annual_finance.fund_sources.build(
            percent: 50,
            type: "Aides publiques"
          )

          expect {
            annual_finance.save!
          }.to raise_error ActiveRecord::RecordInvalid
        end

        it "prevents creating sources that sum below 100%" do
          annual_finance.fund_sources.build(
            percent: 49.9,
            type: "Dons"
          )
          annual_finance.fund_sources.build(
            percent: 50,
            type: "Aides publiques"
          )

          expect {
            annual_finance.save!
          }.to raise_error ActiveRecord::RecordInvalid
        end
      end
    end

    context "#fund_allocations_total_percentage_is_100" do
      context "when creating fund allocations" do
        it "allows creating 1 fund_allocation with 100%" do
          annual_finance.fund_allocations.build(
            percent: 100,
            type: "Missions sociales"
          )
          expect {
            annual_finance.save!
          }.not_to raise_error
        end

        it "allows creating several fund_allocations with 100%" do
          annual_finance.fund_allocations.build(
            percent: 49.9,
            type: "Missions sociales"
          )
          annual_finance.fund_allocations.build(
            percent: 50.1,
            type: "Frais de fonctionnement"
          )
          expect {
            annual_finance.save!
          }.not_to raise_error
        end

        it "prevents creating sources that exceed 100%" do
          annual_finance.fund_allocations.build(
            percent: 50.1,
            type: "Missions sociales"
          )
          annual_finance.fund_allocations.build(
            percent: 50,
            type: "Frais de fonctionnement"
          )

          expect {
            annual_finance.save!
          }.to raise_error ActiveRecord::RecordInvalid
        end

        it "prevents creating sources that sum below 100%" do
          annual_finance.fund_allocations.build(
            percent: 49.9,
            type: "Missions sociales"
          )
          annual_finance.fund_allocations.build(
            percent: 50,
            type: "Frais de fonctionnement"
          )

          expect {
            annual_finance.save!
          }.to raise_error ActiveRecord::RecordInvalid
        end
      end
    end

    describe "database constraints" do
      it "enforces year >= 1000" do
        annual_finance.year = 999
        expect { annual_finance.save }.to raise_error(ActiveRecord::StatementInvalid)
      end

      it "enforces employees_count >= 0" do
        annual_finance.employees_count = -1
        expect { annual_finance.save }.to raise_error(ActiveRecord::StatementInvalid)
      end

      it "enforces budget >= 0" do
        annual_finance.budget = -1
        expect { annual_finance.save }.to raise_error(ActiveRecord::StatementInvalid)
      end
    end
  end
end
