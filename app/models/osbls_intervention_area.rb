class OsblsInterventionArea < ApplicationRecord
  belongs_to :osbl
  belongs_to :intervention_area

  # validates :osbl_id, uniqueness: { scope: :intervention_area_id }
end
