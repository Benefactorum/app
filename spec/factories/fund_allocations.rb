FactoryBot.define do
  factory :fund_allocation, class: "Osbl::FundAllocation" do
    association :annual_finance
    type { "Missions sociales" }
    percent { 100 }
  end
end
