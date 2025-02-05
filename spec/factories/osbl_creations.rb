FactoryBot.define do
  factory :osbl_creation do
    osbl_data do
      {
        name: "OSBL 1",
        tax_reduction: "intérêt_général",
        osbls_causes_attributes: [{cause_id: 1}]
      }
    end
  end
end
