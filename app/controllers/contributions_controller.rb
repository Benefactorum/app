class ContributionsController < ApplicationController
  before_action :get_user_or_current, only: %i[index new]
  before_action :get_user, only: %i[create]
  before_action :only_for_current_user
  before_action :set_contribution, only: %i[show edit update destroy]

  def index
    @contributions = Contribution.all
    render inertia: "Contribution/Index", props: {
      contributions: @contributions.map do |contribution|
        serialize_contribution(contribution)
      end
    }
  end

  def show
    render inertia: "Contribution/Show", props: {
      contribution: serialize_contribution(@contribution)
    }
  end

  def new
    render inertia: "Contribution/New", props: {
      osbl: Osbl.new
    }
  end

  def edit
    render inertia: "Contribution/Edit", props: {
      contribution: serialize_contribution(@contribution)
    }
  end

  def create
    @osbl = Osbl.new(osbl_params)

    if @osbl.save
      redirect_to my_contributions_path, success: "Votre contribution a été enregistrée."
    else
      redirect_to my_new_contribution_path, inertia: {errors: @osbl.errors}
    end
  end

  def update
    if @contribution.update(contribution_params)
      redirect_to @contribution, notice: "Contribution was successfully updated."
    else
      redirect_to edit_contribution_url(@contribution), inertia: {errors: @contribution.errors}
    end
  end

  def destroy
    @contribution.destroy!
    redirect_to contributions_url, notice: "Contribution was successfully destroyed."
  end

  private

  def get_user
    @user = User.find(params[:user_id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_contribution
    @contribution = Contribution.find(params[:id])
  end

  def osbl_params
    params.permit(:name, :website, :logo, :description)
  end

  def serialize_contribution(contribution)
    contribution.as_json(only: [
      :id, :user_id, :status, :contributable_id
    ])
  end
end
