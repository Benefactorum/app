class CreateFundSources < ActiveRecord::Migration[8.0]
  def change
    create_table :fund_sources do |t|
      t.integer :type, null: false
      t.decimal :percent, precision: 5, scale: 2, null: false
      t.decimal :amount, precision: 15, scale: 2
      t.references :annual_finance, null: false, foreign_key: true

      t.timestamps

      t.check_constraint "percent > 0 AND percent <= 100", name: "percent_within_range"
      t.check_constraint "amount > 0", name: "amount_positive"
    end
  end
end
