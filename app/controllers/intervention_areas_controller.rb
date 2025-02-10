class InterventionAreasController < ApplicationController
  def index
    raise unless params[:query].present? && params[:query].length >= 2

    # Use sanitize_sql_like for LIKE-specific escaping and wrap query in wildcards after sanitizing
    sanitized_query = "%#{ActiveRecord::Base.sanitize_sql_like(params[:query])}%"
    intervention_areas = Osbl::InterventionArea
      .where("name LIKE ?", sanitized_query)
      .limit(3)
      .pluck(:id, :name)
      .map { |id, name| {id: id, name: name} }

    render json: intervention_areas, status: :ok
  end

  def create
    intervention_area = Osbl::InterventionArea.create!(name: params[:name])
    render json: intervention_area.slice(:id, :name), status: :created
  end
end
