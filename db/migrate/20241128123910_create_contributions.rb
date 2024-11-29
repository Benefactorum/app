class CreateContributions < ActiveRecord::Migration[8.0]
  def change
    create_table :contributions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :contributable, polymorphic: true, null: false
      t.string :github_resource_url
      t.timestamps
    end
  end
end
