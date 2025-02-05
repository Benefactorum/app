FactoryBot.define do
  factory :annual_finance do
    association :osbl
    year { Time.current.year }
    employees_count { 10 }
  end
end
