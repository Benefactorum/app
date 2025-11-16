class CreateGithubEvent < ActiveRecord::Migration[8.0]
  def change
    create_table :github_events do |t|
      t.string :event, null: false
      t.json :payload, null: false
      t.string :status, null: false, default: "pending"

      t.references :contribution, foreign_key: true

      t.timestamps
    end
  end
end
