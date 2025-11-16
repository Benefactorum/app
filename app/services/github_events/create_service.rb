module GithubEvents
  class CreateService
    attr_reader :github_event

    def initialize(github_event:)
      @github_event = github_event
    end

    def call
      case github_event.event
      when "pull_request" # I should probably not use this one
        handle_pull_request_event
      when "pull_request_review"
        handle_pull_request_review_event
      else
        ignore_event!
      end
    end

    private

    def handle_pull_request_event
      ignore_event! unless github_action == "closed"

      return if contribution.status == "validée"

      contribution.update!(status: "rejetée")
    end

    def handle_pull_request_review_event
      case github_action
      when "submitted"
        case github_event.payload["review"]["state"]
        when "changes_requested"
          ActiveRecord::Base.transaction do
            contribution.update!(status: "modifications demandées")
            github_event.update!(contribution:, status: "processed")
          end
        when "approved" # actually it might be better to do so at the merge event
          ActiveRecord::Base.transaction do
            contribution.update!(status: "validée")
            Osbl.create!(contribution.osbl_data)
            github_event.update!(contribution:, status: "processed")
          end
        else
          ignore_event!
        end
      else
        ignore_event!
      end
    end

    def contribution
      @contribution ||= Contribution.find_by!(github_resource_url: github_event.payload["pull_request"]["html_url"])
    end

    def ignore_event!
      github_event.update!(status: "ignored")
      Rails.logger.info "GitHub event ignored: #{github_event.id}"
    end

    def github_action
      github_event.payload["action"]
    end
  end
end
