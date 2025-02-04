class AddCascadeDeleteToForeignKeys < ActiveRecord::Migration[8.0]
  def change
    # Remove and re-add foreign keys with cascade delete

    # When OSBL is deleted, its annual finances should be removed
    remove_foreign_key "annual_finances", "osbls"
    add_foreign_key "annual_finances", "osbls", on_delete: :cascade

    # When annual finances are deleted, related records should be removed
    remove_foreign_key "fund_allocations", "annual_finances"
    add_foreign_key "fund_allocations", "annual_finances", on_delete: :cascade

    remove_foreign_key "fund_sources", "annual_finances"
    add_foreign_key "fund_sources", "annual_finances", on_delete: :cascade

    # When document is deleted, its attachments should be removed
    remove_foreign_key "document_attachments", "documents"
    add_foreign_key "document_attachments", "documents", on_delete: :cascade

    # When user is deleted, their OTPs and sessions should be removed
    remove_foreign_key "otps", "users"
    add_foreign_key "otps", "users", on_delete: :cascade

    remove_foreign_key "sessions", "users"
    add_foreign_key "sessions", "users", on_delete: :cascade
  end
end
