FactoryBot.define do
  factory :fund_source do
    association :annual_finance
    type { "dons" }
    percent { 100 }
  end
end
