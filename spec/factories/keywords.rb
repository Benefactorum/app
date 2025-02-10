FactoryBot.define do
  factory :keyword, class: "Osbl::Keyword" do
    sequence(:name) { |n| "test#{n}" }
  end
end
