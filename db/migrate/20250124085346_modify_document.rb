class ModifyDocument < ActiveRecord::Migration[8.0]
  def change
    remove_column :documents, :contribution_id, :integer
    remove_column :documents, :osbl_id, :integer
    add_column :documents, :description, :text
    add_column :documents, :year, :integer

    add_check_constraint :documents, "year >= 1000", name: "year_as_4_digits"

    # required year for rapport_activite (1) and rapport_financier (2)
    add_check_constraint(
      :documents,
      "type NOT IN (1, 2) OR (type IN (1, 2) AND year IS NOT NULL)",
      name: "year_required_for_specific_types"
    )

    create_table :document_attachments do |t| # standard:disable Rails/CreateTableWithTimestamps
      t.references :document, null: false, foreign_key: true
      t.references :attachable, polymorphic: true, null: false
    end

    add_index :document_attachments, [:document_id, :attachable_type, :attachable_id], unique: true, name: "index_document_attachments_uniqueness"
  end
end
