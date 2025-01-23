FactoryBot.define do
  factory :fund_allocation do
    association :annual_finance
    type { "missions_sociales" }
    percent { 100 }
  end
end
