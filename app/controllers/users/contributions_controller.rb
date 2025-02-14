module Users
  class ContributionsController < ApplicationController
    before_action :get_current_user, only: %i[index new edit]
    before_action :get_user, only: %i[create destroy]
    before_action :only_for_current_user, only: %i[create destroy]

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

    def new
      render inertia: "Contribution/New", props: {
        location_types: Osbl::Location.types.keys,
        document_types: Document.types.keys,
        fund_source_types: Osbl::FundSource.types.keys,
        fund_allocation_types: Osbl::FundAllocation.types.keys
      }
    end

    def create
      osbl_params = contribution_params.delete(:osbl)
      contribution = @user.contributions.build(contribution_params)
      osbl = Osbl.new(osbl_params)

      if osbl.valid?
        osbl_data = OsblDataTransformer.new(osbl_params, :in).transform
        contribution.contributable = Contribution::OsblCreation.new(osbl_data: osbl_data)

        contribution.save!
        redirect_to my_contributions_path, success: "Votre contribution a été enregistrée."
      else
        redirect_to my_new_contribution_path, inertia: {errors: osbl.errors}
      end
    end

    def edit
      contribution = @user.contributions.related_to_osbl.find(params[:id])
      files = contribution.files.each_with_object({}).with_index do |(attachment, hash), index|
        hash[index] = {
          filename: attachment.filename.to_s,
          url: Rails.application.routes.url_helpers.rails_blob_url(attachment, only_path: true)
        }
      end
      render inertia: "Contribution/Edit", props: {
        location_types: Osbl::Location.types.keys,
        document_types: Document.types.keys,
        fund_source_types: Osbl::FundSource.types.keys,
        fund_allocation_types: Osbl::FundAllocation.types.keys,
        contribution: {
          id: contribution.id,
          body: contribution.body,
          files: files,
          osbl: OsblDataTransformer.new(contribution.osbl_data, :out).transform
        }
      }
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
          files: ["0", "1", "2", "3", "4"],
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
