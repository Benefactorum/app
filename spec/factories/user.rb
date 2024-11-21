# This will guess the User class
FactoryBot.define do
  factory :user do
    first_name { "John" }
    last_name  { "Doe" }
    email { "john.doe@mail.com" }
    terms_and_privacy_accepted_at { DateTime.current }
    otp_expires_at { DateTime.current + 10.minutes }
    otp_counter { 1 }
  end
end
