class AddMoreConstraintToAddress < ActiveRecord::Migration[8.0]
  def change
    add_check_constraint :addresses, "latitude >= -90 AND latitude <= 90", name: "check_latitude_range"
    add_check_constraint :addresses, "longitude >= -180 AND longitude <= 180", name: "check_longitude_range"
  end
end
