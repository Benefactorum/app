FactoryBot.define do
  factory :label, class: "Osbl::Label" do
    sequence(:name) { |n| "Label #{n}" }
  end
end
