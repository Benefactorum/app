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

    # reversible do |dir|
    #   dir.up do
    #     execute <<-SQL
    #       CREATE TRIGGER enforce_percent_sum_insert
    #       AFTER INSERT ON fund_sources
    #       FOR EACH ROW
    #       BEGIN
    #         SELECT CASE
    #           WHEN (
    #             SELECT COALESCE(SUM(percent), 0)
    #             FROM fund_sources
    #             WHERE annual_finance_id = NEW.annual_finance_id
    #           ) != 100
    #           THEN RAISE(FAIL, 'La somme des pourcentages doit être exactement 100%')
    #         END;
    #       END;
    #     SQL

    #     execute <<-SQL
    #       CREATE TRIGGER enforce_percent_sum_update
    #       AFTER UPDATE ON fund_sources
    #       FOR EACH ROW
    #       BEGIN
    #         SELECT CASE
    #           WHEN (
    #             SELECT COALESCE(SUM(percent), 0)
    #             FROM fund_sources
    #             WHERE annual_finance_id = NEW.annual_finance_id
    #           ) != 100
    #           THEN RAISE(FAIL, 'La somme des pourcentages doit être exactement 100%')
    #         END;
    #       END;
    #     SQL

    #     execute <<-SQL
    #       CREATE TRIGGER enforce_percent_sum_delete
    #       AFTER DELETE ON fund_sources
    #       FOR EACH ROW
    #       BEGIN
    #         SELECT CASE
    #           WHEN (
    #             SELECT COALESCE(SUM(percent), 0)
    #             FROM fund_sources
    #             WHERE annual_finance_id = OLD.annual_finance_id
    #           ) != 100
    #           THEN RAISE(FAIL, 'La somme des pourcentages doit être exactement 100%')
    #         END;
    #       END;
    #     SQL
    #   end

    #   dir.down do
    #     execute "DROP TRIGGER IF EXISTS enforce_percent_sum_insert;"
    #     execute "DROP TRIGGER IF EXISTS enforce_percent_sum_update;"
    #     execute "DROP TRIGGER IF EXISTS enforce_percent_sum_delete;"
    #   end
    # end
  end
end
