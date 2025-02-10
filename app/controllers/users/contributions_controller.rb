module Users
  class ContributionsController < ApplicationController
    before_action :get_user_or_current, only: %i[index new]
    before_action :get_user, only: %i[create]
    before_action :only_for_current_user

    def index
      render inertia: "Contribution/Index", props: {
        contributions: @user.contributions.map(&:serialize)
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
      osbl_params = contribution_params.delete(:osbl)
      contribution = @user.contributions.build(contribution_params)
      osbl = Osbl.new(osbl_params)

      if osbl.valid?
        osbl_data = OsblDataTransformer.new(osbl_params).transform
        contribution.contributable = OsblCreation.new(osbl_data: osbl_data)

        contribution.save!
        redirect_to my_contributions_path, success: "Votre contribution a été enregistrée."
      else
        redirect_to my_new_contribution_path, inertia: {errors: osbl.errors}
      end
    end

    private

    def get_user
      @user = User.find(params[:user_id])
    end

    def contribution_params
      @contribution_params ||= params.expect(
        contribution: [
          :body,
          files: [],
          osbl: [
            :name,
            :website,
            :logo,
            :description,
            :tax_reduction,
            :geographical_scale,
            :osbl_type,
            :public_utility,
            :creation_year,
            osbls_causes_attributes: [[:cause_id]],
            osbls_keywords_attributes: [[:keyword_id]],
            osbls_intervention_areas_attributes: [[:intervention_area_id]],
            osbls_labels_attributes: [[:label_id]],
            annual_finances_attributes: [[
              :year,
              :certified,
              :budget,
              :treasury,
              :employees_count,
              fund_sources_attributes: [[
                :type,
                :percent,
                :amount
              ]],
              fund_allocations_attributes: [[
                :type,
                :percent,
                :amount
              ]]
            ]],
            document_attachments_attributes: [[
              document_attributes: [
                :type,
                :file,
                :name,
                :year,
                :description
              ]
            ]],
            locations_attributes: [[
              :type,
              :name,
              :description,
              :website,
              address_attributes: [
                :street_number,
                :street_name,
                :additional_info,
                :postal_code,
                :city,
                :latitude,
                :longitude
              ]
            ]]
          ]
        ]
      )
    end
  end
end
