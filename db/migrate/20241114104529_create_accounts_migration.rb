class CreateAccountsMigration < ActiveRecord::Migration[8.0]
  def change
    create_table :accounts # standard:disable Rails/CreateTableWithTimestamps
  end
end
