require "rails_helper"

RSpec.describe JoinTables::DocumentAttachment, type: :model do
  describe "callbacks" do
    describe "after_destroy" do
      let(:document) { create(:document) }

      context "when document is attached to multiple records" do
        let!(:document_attachment1) { create(:document_attachment, document: document) }
        let!(:document_attachment2) { create(:document_attachment, document: document) }

        it "does not destroy the document when one attachment is destroyed" do
          expect {
            document_attachment1.destroy
          }.not_to change(Document, :count)
        end
      end

      context "when document is attached to single record" do
        let!(:document_attachment) { create(:document_attachment) }

        it "destroys the document when the last attachment is destroyed" do
          expect {
            document_attachment.destroy
          }.to change(Document, :count).by(-1)
        end
      end
    end
  end

  describe "db constraints" do
    describe "uniqueness of document per attachable" do
      let(:osbl) { create(:osbl) }
      let(:document) { create(:document) }
      let!(:existing_attachment) { create(:document_attachment, document: document, attachable: osbl) }

      it "prevents attaching the same document twice to the same record" do
        document_attachment = build(:document_attachment, document: document, attachable: osbl)

        expect(document_attachment).not_to be_valid
        expect { document_attachment.save!(validate: false) }.to raise_error(ActiveRecord::RecordNotUnique)
      end

      it "allows attaching the same document to different records" do
        different_osbl = create(:osbl)
        new_attachment = build(:document_attachment, document: document, attachable: different_osbl)

        expect(new_attachment).to be_valid
        expect { new_attachment.save! }.not_to raise_error
      end
    end
  end
end
