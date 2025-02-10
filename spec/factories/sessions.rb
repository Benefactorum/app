# This will guess the User class
FactoryBot.define do
  factory :session, class: "User::Session" do
    user { create(:user) }
  end
end
