class Osbl::JoinTables::OsblsInterventionArea < ApplicationRecord
  self.table_name = "osbls_intervention_areas"

  belongs_to :osbl
  belongs_to :intervention_area, class_name: "Osbl::InterventionArea"

  # validates :osbl_id, uniqueness: { scope: :intervention_area_id }
end
