FactoryBot.define do
  factory :fund_source do
    association :annual_finance
    type { "Dons" }
    percent { 100.00 }
  end
end
