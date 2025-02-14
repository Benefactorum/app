class KeywordsController < ApplicationController
  def index
    raise unless params[:query].present? && params[:query].length >= 3

    # Use sanitize_sql_like for LIKE-specific escaping and wrap query in wildcards after sanitizing
    sanitized_query = "%#{ActiveRecord::Base.sanitize_sql_like(params[:query])}%"
    keywords = Osbl::Keyword
      .where("name LIKE ?", sanitized_query)
      .limit(3)
      .select(:id, :name)
      .as_json

    render json: keywords, status: :ok
  end

  def create
    keyword = Osbl::Keyword.create!(name: params[:name])
    render json: keyword.slice(:id, :name), status: :created
  end
end
