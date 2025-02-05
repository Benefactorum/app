# This will guess the User class
FactoryBot.define do
  factory :user do
    sequence(:first_name) { |n| "John_#{n}" }
    sequence(:last_name) { |n| "Doe_#{n}" }
    sequence(:email) { |n| "john.doe+#{n}@example.com" }
    terms_and_privacy_accepted_at { DateTime.current }

    trait :with_otp do
      after(:create) do |user|
        create(:otp, user: user)
      end
    end
  end
end
