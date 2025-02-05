FactoryBot.define do
  factory :contribution do
    association :user
    status { "brouillon" }

    trait :osbl_creation do
      contributable { build(:osbl_creation_data) }
    end

    # factories for contributable below

    factory :osbl_creation_data do
      osbl_data do
        {
          name: "OSBL 1",
          tax_reduction: "intérêt_général",
          osbls_causes_attributes: [{cause_id: 1}]
        }
      end
    end
  end
end
