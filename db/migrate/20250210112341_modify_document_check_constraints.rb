class ModifyDocumentCheckConstraints < ActiveRecord::Migration[8.0]
  def change
    # required name for proces_verbal (3) and autre (4)
    add_check_constraint :documents, "type NOT IN (3, 4) OR (type IN (3, 4) AND name IS NOT NULL)",
      name: "name_required_for_specific_types"
  end
end
