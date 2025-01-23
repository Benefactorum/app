FactoryBot.define do
  factory :osbl do
    sequence(:name) { |n| "OSBL #{n}" }
    sequence(:website) { |n| "https://osbl#{n}.example.com" }
    tax_reduction { "intérêt_général" }
  end
end
