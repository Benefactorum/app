FactoryBot.define do
  factory :otp do
    association :user
    counter { 1 }
  end

  trait :used do
    used { true }
  end
end
