FactoryBot.define do
  factory :cause do
    sequence(:name) { |n| "Cause #{n}" }
  end
end
