class Webhooks::GithubEventsController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate
  skip_before_action :require_authentication

  before_action :validate_signature

  def create
    github_event = GithubEvent.create!(
      event: request.headers["X-GitHub-Event"],
      payload: request.request_parameters.except("repository", "organization")
      # contribution: Contribution.find_by!(github_resource_url: payload["pull_request"]["url"])
    )

    GithubEvents::CreateService.new(github_event:).call

    head :ok
  end

  private

  def validate_signature
    signature = request.headers["X-Hub-Signature-256"]
    head :unauthorized and return unless signature&.start_with?("sha256=")

    secret = Rails.application.credentials.github.webhook_secret
    expected = "sha256=" + OpenSSL::HMAC.hexdigest("sha256", secret, request.raw_post)

    unless ActiveSupport::SecurityUtils.secure_compare(expected, signature)
      Rails.logger.warn "Invalid GitHub webhook signature"
      head :unauthorized
    end
  end
end
