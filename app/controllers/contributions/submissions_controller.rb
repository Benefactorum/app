module Contributions
  class SubmissionsController < ApplicationController
    def create
      contribution = Current.user.contributions.find(params.expect(:contribution_id))
      contribution.update!(status: "en attente de revue")
      redirect_to my_contributions_path
    end
  end
end
