FactoryBot.define do
  factory :otp, class: "User::Otp" do
    association :user
    counter { 1 }
  end

  trait :used do
    used { true }
  end
end
