FactoryBot.define do
  factory :osbl do
    sequence(:name) { |n| "OSBL #{n}" }
    tax_reduction { "intérêt_général" }

    after(:build) do |osbl|
      osbl.causes << build(:cause) if osbl.causes.empty?
    end

    trait :with_document do
      after(:build) do |osbl|
        osbl.documents << build(:document)
      end
    end
  end
end
