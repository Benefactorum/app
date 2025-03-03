FactoryBot.define do
  factory :osbl_import do
    osbl_uri { "https://universsel.org/" }
    status { "initialized" }
    firecrawl_job_id { "123" }
    user
    extracted_data {
      {
        "name" => "Univers-Sel",
        "tax_reduction" => "intérêt_général",
        "osbls_causes_attributes" => [
          {
            "name" => "Aide internationale"
          }
        ]
      }
    }
  end
end
