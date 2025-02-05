FactoryBot.define do
  factory :contribution do
    association :user
    status { "brouillon" }
    contributable { build(:osbl_creation) }

    trait :osbl_creation do
      contributable { build(:osbl_creation) }
    end
  end
end
