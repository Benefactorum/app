class KeywordsController < ApplicationController
  def index
    raise unless params[:query].present? && params[:query].length >= 3

    # Use sanitize_sql_like for LIKE-specific escaping and wrap query in wildcards after sanitizing
    sanitized_query = "%#{ActiveRecord::Base.sanitize_sql_like(params[:query])}%"
    keywords = Keyword
      .where("name LIKE ?", sanitized_query)
      .limit(3)
      .pluck(:id, :name)
      .map { |id, name| {id: id, name: name} }

    render json: keywords, status: :ok
  end

  def create
    keyword = Keyword.create!(name: params[:name])
    render json: keyword.slice(:id, :name), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: {error: e.message}, status: :unprocessable_entity
  end
end
