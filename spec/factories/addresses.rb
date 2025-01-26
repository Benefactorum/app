FactoryBot.define do
  factory :address do
    street_number { "MyString" }
    street_name { "MyString" }
    postal_code { "MyString" }
    city { "MyString" }
    country { "MyString" }
    latitude { 1.5 }
    longitude { 1.5 }
    addressable { nil }
  end
end
