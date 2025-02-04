FactoryBot.define do
  factory :location do
    association :osbl
    type { :siege_social }

    after(:build) do |location|
      location.address ||= build(:address, addressable: location)
    end

    trait :with_name do
      name { "Location name" }
    end

    trait :siege_social do
      type { :siege_social }
    end

    trait :antenne_locale do
      type { :antenne_locale }
      with_name
    end

    trait :lieu_d_activite do
      type { :lieu_d_activite }
      with_name
    end

    trait :autre do
      type { :autre }
      with_name
    end
  end
end
