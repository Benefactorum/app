# This will guess the User class
FactoryBot.define do
  factory :user do
    first_name { "John" }
    last_name  { "Doe" }
    email { "john.doe@mail.com" }
    terms_and_privacy_accepted_at { DateTime.current }
  end
end
