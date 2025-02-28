class OsblImportsController < ApplicationController
  before_action :require_admin

  def create
    osbl_uri = params.expect(:osbl_uri)
    osbl_import_id = OsblScraperService.new(osbl_uri).call
    render json: {osbl_import_id: osbl_import_id}, status: :created
  end
end
