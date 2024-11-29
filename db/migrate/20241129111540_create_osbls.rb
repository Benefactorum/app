class CreateOsbls < ActiveRecord::Migration[8.0]
  def change
    create_table :osbls do |t|
      t.string :name

      t.timestamps
    end
  end
end
