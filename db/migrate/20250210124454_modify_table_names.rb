class ModifyTableNames < ActiveRecord::Migration[8.0]
  def up
    rename_table :causes, :osbl_causes if table_exists?(:causes)
    rename_table :locations, :osbl_locations if table_exists?(:locations)
    rename_table :intervention_areas, :osbl_intervention_areas if table_exists?(:intervention_areas)
    rename_table :keywords, :osbl_keywords if table_exists?(:keywords)
    rename_table :labels, :osbl_labels if table_exists?(:labels)
    rename_table :fund_sources, :osbl_fund_sources if table_exists?(:fund_sources)
    rename_table :annual_finances, :osbl_annual_finances if table_exists?(:annual_finances)
    rename_table :fund_allocations, :osbl_fund_allocations if table_exists?(:fund_allocations)
    rename_table :otps, :user_otps if table_exists?(:otps)
    rename_table :sessions, :user_sessions if table_exists?(:sessions)
  end

  def down
    rename_table :osbl_causes, :causes if table_exists?(:osbl_causes)
    rename_table :osbl_locations, :locations if table_exists?(:osbl_locations)
    rename_table :osbl_intervention_areas, :intervention_areas if table_exists?(:osbl_intervention_areas)
    rename_table :osbl_keywords, :keywords if table_exists?(:osbl_keywords)
    rename_table :osbl_labels, :labels if table_exists?(:osbl_labels)
    rename_table :osbl_fund_sources, :fund_sources if table_exists?(:osbl_fund_sources)
    rename_table :osbl_annual_finances, :annual_finances if table_exists?(:osbl_annual_finances)
    rename_table :osbl_fund_allocations, :fund_allocations if table_exists?(:osbl_fund_allocations)
    rename_table :user_otps, :otps if table_exists?(:user_otps)
    rename_table :user_sessions, :sessions if table_exists?(:user_sessions)
  end
end
