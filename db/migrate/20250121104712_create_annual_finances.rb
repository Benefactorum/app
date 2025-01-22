class CreateAnnualFinances < ActiveRecord::Migration[8.0]
  def up
    create_table :annual_finances do |t|
      t.integer :year, null: false
      t.decimal :treasury, precision: 15, scale: 2
      t.decimal :budget, precision: 15, scale: 2
      t.boolean :certified
      t.integer :employees_count
      t.references :osbl, null: false, foreign_key: true

      t.timestamps
    end

    add_check_constraint :annual_finances, "employees_count >= 0", name: "employees_count_positive"
    add_check_constraint :annual_finances, "budget >= 0", name: "budget_positive"
    add_check_constraint :annual_finances, "year >= 1000", name: "year_as_4_digits"
  end

  def down
    remove_check_constraint :annual_finances, name: "budget_positive"
    remove_check_constraint :annual_finances, name: "employees_count_positive"
    remove_check_constraint :annual_finances, name: "year_as_4_digits"
    drop_table :annual_finances
  end
end
