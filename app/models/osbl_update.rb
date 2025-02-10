class OsblUpdate < ApplicationRecord
  serialize :osbl_data, coder: JSON
end
