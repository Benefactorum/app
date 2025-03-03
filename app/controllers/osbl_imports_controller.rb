class OsblImportsController < ApplicationController
  before_action :require_admin

  def create
    osbl_import = OsblImports::CreateService.new(
      osbl_uri: params.expect(:osbl_uri)
    ).call

    render json: osbl_import.as_json(only: [:id]), status: :created
  end

  def show
    osbl_import = OsblImport.find(params.require(:id))

    render json: osbl_import.as_json(only: [:id, :status, :contribution_id])
  end
end
