FactoryBot.define do
  factory :document_attachment do
    document
    attachable { create(:osbl) }
  end
end
