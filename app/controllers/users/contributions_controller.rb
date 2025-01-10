module Users
  class ContributionsController < ApplicationController
    before_action :get_user_or_current, only: %i[index new]
    before_action :get_user, only: %i[create]
    before_action :only_for_current_user

    def index
      @contributions = Contribution.all
      render inertia: "Contribution/Index", props: {
        contributions: @contributions.map do |contribution|
          serialize_contribution(contribution)
        end
      }
    end

    def new
      render inertia: "Contribution/New"
    end

    def create
      @osbl = Osbl.new(osbl_params)

      if @osbl.save
        redirect_to my_contributions_path, success: "Votre contribution a été enregistrée."
      else
        redirect_to my_new_contribution_path, inertia: {errors: @osbl.errors}
      end
    end

    private

    def get_user
      @user = User.find(params[:user_id])
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
end
