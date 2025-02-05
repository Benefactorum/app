FactoryBot.define do
  factory :keyword do
    sequence(:name) { |n| "test#{n}" }
  end
end
