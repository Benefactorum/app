class AddCheckConstraintToKeywords < ActiveRecord::Migration[8.0]
  def change
    add_check_constraint :keywords, "length(name) >= 3 AND length(name) <= 100", name: "keywords_name_length_check"
  end
end
