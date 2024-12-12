class CreateOtps < ActiveRecord::Migration[8.0]
  def change
    create_table :otps do |t|
      t.references :user, null: false, foreign_key: true
      t.string :secret, null: false
      t.integer :counter, default: 0
      t.boolean :used, null: false, default: false

      t.timestamps
    end
  end
end
