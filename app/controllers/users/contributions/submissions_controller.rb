module Users
  module Contributions
    class SubmissionsController < ApplicationController
      def create
        contribution = Current.user.contributions.where(status: "brouillon").find(params.expect(:contribution_id))

        CreatePullRequestForOsblCreationJob.perform_later(contribution.id)
        contribution.update!(status: "en cours d'envoi")

        redirect_to my_contributions_path, flash: {info: "Votre contribution est en cours d'envoi"}
      end
    end
  end
end
