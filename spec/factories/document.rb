FactoryBot.define do
  factory :document do
    type { "statuts" }
    file { fixture_file_upload("spec/fixtures/files/sample.pdf", "application/pdf") }
  end
end
