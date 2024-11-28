class CreateContributions < ActiveRecord::Migration[8.0]
  def change
    create_table :contributions do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :status, null: false, default: 0
      t.references :contributable, polymorphic: true, null: false

      t.timestamps
    end

    add_index :contributions, :status
  end
end
