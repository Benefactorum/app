FactoryBot.define do
  factory :intervention_area do
    sequence(:name) { |n| "test#{n}" }
  end
end
