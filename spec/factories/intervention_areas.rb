FactoryBot.define do
  factory :intervention_area, class: "Osbl::InterventionArea" do
    sequence(:name) { |n| "test#{n}" }
  end
end
