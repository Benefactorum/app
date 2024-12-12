# This will guess the User class
FactoryBot.define do
  factory :user do
    sequence(:first_name) { |n| "John_#{n}" }
    sequence(:last_name) { |n| "Doe_#{n}" }
    sequence(:email) { |n| "john.doe+#{n}@example.com" }
    terms_and_privacy_accepted_at { DateTime.current }
    # otp_expires_at { DateTime.current + 10.minutes }
    # otp_counter { 1 }
    # otp

    trait :with_otp do
      after(:create) do |user|
        create(:otp, user: user)
      end
    end
  end
end
