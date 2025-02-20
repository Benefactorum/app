module Users
  class ContributionsController < ApplicationController
    before_action :get_current_user, only: %i[index show new edit]
    before_action :get_user, only: %i[create update destroy]
    before_action :only_for_current_user, only: %i[create update destroy]

    def index
      render inertia: "Contribution/Index", props: {
        contributions: @user.contributions.with_osbl_names.as_json(
          only: %i[
            id
            contributable_type
            status
            created_at
            github_resource_url
            osbl_name
          ]
        )
      }
    end

    def show
      contribution = @user.contributions.related_to_osbl.find(params[:id])
      render inertia: "Osbl/Show", props: {
        contribution: contribution.as_json(only: %i[id status]),
        osbl: Contributions::OsblData::Serializer.new(contribution.osbl_data, :display).call
      }
    end

    def new
      render inertia: "Contribution/New", props: {
        location_types: Osbl::Location.types.keys,
        document_types: Document.types.keys,
        fund_source_types: Osbl::FundSource.types.keys,
        fund_allocation_types: Osbl::FundAllocation.types.keys
      }
    end

    def create
      status, result = Contributions::CreateService.new(
        user: @user,
        params: contribution_params
      ).call

      if status == :ok
        redirect_to my_contribution_path(result.id), success: "Votre contribution a été enregistrée."
      else
        redirect_to my_new_contribution_path, inertia: {errors: result}
      end
    end

    def edit
      contribution = @user.contributions.related_to_osbl.find(params[:id])
      render inertia: "Contribution/Edit", props: {
        location_types: Osbl::Location.types.keys,
        document_types: Document.types.keys,
        fund_source_types: Osbl::FundSource.types.keys,
        fund_allocation_types: Osbl::FundAllocation.types.keys,
        contribution: Contributions::Serializer.new(contribution).call
      }
    end

    def update
      contribution = @user.contributions.related_to_osbl.find(params[:id])
      status, result = Contributions::UpdateService.new(
        contribution: contribution,
        params: contribution_params
      ).call

      if status == :ok
        redirect_to my_contribution_path(result.id), success: "Votre contribution a été modifiée."
      else
        redirect_to edit_my_contribution_path(contribution), inertia: {errors: result}
      end
    end

    def destroy
      contribution = @user.contributions.where(status: :brouillon).find(params[:id])
      contribution.destroy!
      redirect_to my_contributions_path, success: "Votre contribution a été supprimée."
    end

    private

    def get_user
      @user = User.find(params[:user_id])
    end

    def contribution_params
      @contribution_params ||= params.expect(
        contribution: [
          :body,
          files: {},
          osbl: [
            :name,
            :website,
            :logo,
            {logo: [:filename, :url]},
            :description,
            :tax_reduction,
            :geographical_scale,
            :osbl_type,
            :public_utility,
            :creation_year,
            osbls_causes_attributes: [[:cause_id, :name]],
            osbls_keywords_attributes: [[:keyword_id, :name]],
            osbls_intervention_areas_attributes: [[:intervention_area_id, :name]],
            osbls_labels_attributes: [[:label_id, :name]],
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
                {file: [:filename, :url]},
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
      ).tap do |params|
        params[:files] = params[:files]&.values
      end
    end
  end
end
