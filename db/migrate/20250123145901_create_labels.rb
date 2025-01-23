class CreateLabels < ActiveRecord::Migration[8.0]
  def change
    create_table :labels do |t|
      t.string :name, null: false, index: {unique: true}
      t.text :description
      t.string :website

      t.timestamps
    end
  end
end
