FactoryBot.define do
  factory :document_attachment, class: "JoinTables::DocumentAttachment" do
    document
    attachable { create(:osbl) }
  end
end
