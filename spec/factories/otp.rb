FactoryBot.define do
  factory :otp do
    association :user
    # secret { SecureRandom.hex(10) } # Generates a random 20-character hexadecimal string
    # counter { 0 }
    # used { false }
    # created_at { DateTime.current }
    # updated_at { DateTime.current }
  end

  trait :used do
    used { true }
  end
end
