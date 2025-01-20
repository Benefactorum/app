class KeywordsController < ApplicationController
  def index
    @keywords = if params[:query].present? && params[:query].length >= 3
      Keyword.where("name LIKE ?", "%#{params[:query]}%").limit(3).pluck(:id, :name).map { |id, name| {id: id, name: name} }

    else
      []
    end
    render json: @keywords, status: :ok
  end

  def create
    keyword = Keyword.create!(name: params[:name])
    render json: keyword.slice(:id, :name), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: {error: e.message}, status: :unprocessable_entity
  end
end
