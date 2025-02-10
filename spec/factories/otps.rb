FactoryBot.define do
  factory :otp, class: "Users::Otp" do
    association :user
    counter { 1 }
  end

  trait :used do
    used { true }
  end
end
