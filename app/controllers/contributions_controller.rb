class ContributionsController < ApplicationController
  before_action :get_user_or_current, only: %i[index]
  before_action :get_user, only: %i[new create]
  before_action :only_for_current_user
  before_action :set_contribution, only: %i[show edit update destroy]

  # GET /contributions
  def index
    @contributions = Contribution.all
    render inertia: "Contribution/Index", props: {
      contributions: @contributions.map do |contribution|
        serialize_contribution(contribution)
      end
    }
  end

  # GET /contributions/1
  def show
    render inertia: "Contribution/Show", props: {
      contribution: serialize_contribution(@contribution)
    }
  end

  # GET /contributions/new
  def new
    @contribution = Contribution.new
    render inertia: "Contribution/New", props: {
      contribution: serialize_contribution(@contribution)
    }
  end

  # GET /contributions/1/edit
  def edit
    render inertia: "Contribution/Edit", props: {
      contribution: serialize_contribution(@contribution)
    }
  end

  # POST /contributions
  def create
    @contribution = Contribution.new(contribution_params)

    if @contribution.save
      redirect_to @contribution, notice: "Contribution was successfully created."
    else
      redirect_to new_user_contribution_url, inertia: {errors: @contribution.errors}
    end
  end

  # PATCH/PUT /contributions/1
  def update
    if @contribution.update(contribution_params)
      redirect_to @contribution, notice: "Contribution was successfully updated."
    else
      redirect_to edit_contribution_url(@contribution), inertia: {errors: @contribution.errors}
    end
  end

  # DELETE /contributions/1
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

  # Only allow a list of trusted parameters through.
  def contribution_params
    params.require(:contribution).permit(:user_id, :status, :contributable_id, :contributable_type)
  end

  def serialize_contribution(contribution)
    contribution.as_json(only: [
      :id, :user_id, :status, :contributable_id
    ])
  end
end
