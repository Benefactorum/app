class AddContributableTables < ActiveRecord::Migration[8.0]
  def change
    create_table :osbl_updates do |t| # standard:disable Rails/CreateTableWithTimestamps
      t.text :osbl_data, null: false
    end

    create_table :feedbacks do |t| # standard:disable Rails/CreateTableWithTimestamps
    end

    create_table :feature_requests do |t| # standard:disable Rails/CreateTableWithTimestamps
    end

    create_table :bug_reports do |t| # standard:disable Rails/CreateTableWithTimestamps
    end

    create_table :correction_requests do |t| # standard:disable Rails/CreateTableWithTimestamps
    end

    create_table :others do |t| # standard:disable Rails/CreateTableWithTimestamps
    end
  end
end
