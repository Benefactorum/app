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
        causes: Cause.pluck(:name, :id).to_h,
        labels: Label.pluck(:id, :name).map { |id, name| {value: id, label: name} },
        location_types: Location.types.keys,
        document_types: Document.types.keys,
        fund_source_types: FundSource.types.keys,
        fund_allocation_types: FundAllocation.types.keys
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
        {osbls_labels_attributes: [:label_id]},
        {annual_finances_attributes: [
          :year,
          :certified,
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
        ]},
        {document_attachments_attributes: [
          {document_attributes: [
            :type,
            :file,
            :name,
            :year,
            :description
          ]}
        ]},
        {locations_attributes: [
          :type,
          :name,
          :description,
          :website,
          {address_attributes: [
            :street_number,
            :street_name,
            :additional_info,
            :postal_code,
            :city,
            :latitude,
            :longitude
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
