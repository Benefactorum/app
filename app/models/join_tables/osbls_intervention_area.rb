class JoinTables::OsblsInterventionArea < ApplicationRecord
  belongs_to :osbl
  belongs_to :intervention_area, class_name: "Osbl::InterventionArea"

  attribute :name, :string

  validates :osbl_id, uniqueness: {scope: :intervention_area_id}
end
