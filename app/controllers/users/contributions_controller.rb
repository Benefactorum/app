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
      render inertia: "Contribution/New", props: {
        causes: Cause.pluck(:name, :id).to_h
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

    private

    def get_user
      @user = User.find(params[:user_id])
    end

    def osbl_params
      params.permit(
        :name,
        :website,
        :logo,
        :description,
        {osbls_causes_attributes: [:cause_id]},
        :tax_reduction,
        {osbls_keywords_attributes: [:keyword_id]},
        :geographical_scale,
        {osbls_intervention_areas_attributes: [:intervention_area_id]},
        :osbl_type,
        :public_utility,
        :creation_year,
        :contact_email,
        {annual_finances_attributes: [
          :year,
          :budget,
          :treasury,
          :employees_count,
          {fund_sources_attributes: [
            :type,
            :percent,
            :amount
          ]},
          {fund_allocations_attributes: [
            :type,
            :percent,
            :amount
          ]}
        ]}
      )
    end

    def serialize_contribution(contribution)
      contribution.as_json(only: [
        :id, :user_id, :status, :contributable_id
      ])
    end
  end
end
