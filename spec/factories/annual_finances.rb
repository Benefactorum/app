FactoryBot.define do
  factory :annual_finance, class: "Osbl::AnnualFinance" do
    association :osbl
    year { Time.current.year }
    employees_count { 10 }
  end
end
