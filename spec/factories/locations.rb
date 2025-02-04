FactoryBot.define do
  factory :location do
    association :osbl
    type { "Siège social" }

    after(:build) do |location|
      location.address ||= build(:address, addressable: location)
    end

    trait :with_name do
      name { "Location name" }
    end

    trait :siege_social do
      type { "Siège social" }
    end

    trait :antenne_locale do
      type { "Antenne locale" }
      with_name
    end

    trait :lieu_d_activite do
      type { "Lieu d'activité" }
      with_name
    end

    trait :autre do
      type { "Autre" }
      with_name
    end
  end
end
