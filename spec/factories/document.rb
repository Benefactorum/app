FactoryBot.define do
  factory :document do
    type { "Statuts" }
    file { fixture_file_upload("spec/fixtures/files/sample.pdf", "application/pdf") }
  end
end
