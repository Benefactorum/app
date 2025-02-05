FactoryBot.define do
  factory :address do
    street_name { "Rue de la Paix" }
    postal_code { "75002" }
    city { "Paris" }
    latitude { 48.8566 }
    longitude { 2.3522 }

    # create(:address)  # Creates with new location
    # create(:address, addressable: user)  # Uses existing addressable
    after(:build) do |address, evaluator|
      address.addressable = evaluator.addressable || create(:location, address: address)
    end
  end
end
