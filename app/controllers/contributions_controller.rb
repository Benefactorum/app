class ContributionsController < ApplicationController
  before_action :set_contribution
  before_action -> { require_current_user_or_admin(resource_user: @contribution.user) }, only: %i[edit update]

  def show
    render inertia: "Osbl/Show", props: {
      contribution: @contribution.as_json(only: %i[id status user_id]),
      osbl: Contributions::OsblData::Serializer.new(@contribution.osbl_data, :display).call
    }
  end

  def edit
    render inertia: "Contribution/Edit", props: {
      location_types: Osbl::Location.types.keys,
      document_types: Document.types.keys,
      fund_source_types: Osbl::FundSource.types.keys,
      fund_allocation_types: Osbl::FundAllocation.types.keys,
      contribution: Contributions::Serializer.new(@contribution).call
    }
  end

  def update
    status, result = Contributions::UpdateService.new(
      contribution: @contribution,
      params: contribution_params
    ).call

    if status == :ok
      redirect_to contribution_path(result.id), success: "La contribution a été modifiée."
    else
      redirect_to edit_contribution_path(@contribution), inertia: {errors: result}
    end
  end

  private

  def set_contribution
    @contribution = Contribution.related_to_osbl.where(status: ["en attente de validation", "modifications demandées"]).find(params[:id])
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
          {logo: [:filename, :url, :key]},
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
              {file: [:filename, :url, :key]},
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
      document_attachments = params.dig(:osbl, :document_attachments_attributes)
      if document_attachments.present? && !document_attachments.is_a?(Array)
        params[:osbl][:document_attachments_attributes] = document_attachments.values
      end
    end
  end
end
