FactoryBot.define do
  factory :contribution do
    user { nil }
    status { 0 }
    contributable { nil }
  end
end
