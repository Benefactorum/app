FactoryBot.define do
  factory :osbl do
    sequence(:name) { |n| "OSBL #{n}" }
    sequence(:website) { |n| "https://osbl#{n}.example.com" }
    tax_reduction { "intérêt_général" }

    after(:build) do |osbl|
      osbl.causes << build(:cause) if osbl.causes.empty?
    end
  end
end
