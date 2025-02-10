FactoryBot.define do
  factory :cause, class: "Osbl::Cause" do
    sequence(:name) { |n| "Cause #{n}" }
  end
end
