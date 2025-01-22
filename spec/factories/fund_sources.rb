FactoryBot.define do
  factory :fund_source do
    type { :dons }
    percent { 10 }

    annual_finance { nil }
  end
end
