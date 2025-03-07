class CreatePullRequestForOsblCreationJob < ApplicationJob
  queue_as :default

  include Rails.application.routes.url_helpers

  def default_url_options
    Rails.application.config.action_mailer.default_url_options
  end

  # Retry with exponential backoff if GitHub API fails
  retry_on Octokit::Error, wait: :exponentially_longer, attempts: 2

  def perform(contribution_id)
    contribution = Contribution.find(contribution_id)

    json_data = Contributions::OsblData::Serializer.new(contribution.osbl_data).call
    osbl_name = json_data["name"]

    # Should be moved to a config file as constants
    repo_owner = "Benefactorum"
    repo_name = "contributions"

    new_branch_name = "osbl_creation/#{Time.current.strftime("%Y-%m-%d")}/#{contribution.id}/#{osbl_name.parameterize}"

    github_service = GithubApi.new(
      app_id: Rails.application.credentials.github[:app_id],
      private_key: Rails.application.credentials.github[:private_key],
      installation_id: Rails.application.credentials.github[:installation_id]
    )

    github_service.create_commit_on_new_branch(
      repo_owner:,
      repo_name:,
      new_branch_name:,
      commit_message: "Osbl Creation of #{osbl_name}",
      file_path: osbl_name.parameterize + ".json",
      file_content: JSON.pretty_generate(json_data) + "\n"
    )

    # Create a pull request
    pr = github_service.create_pull_request(
      repo_owner:,
      repo_name:,
      title: "Création de l'OSBL: #{osbl_name}",
      body: generate_pr_body(contribution),
      head_branch: new_branch_name
    )

    # Request review from moderators team
    github_service.request_pull_request_review(
      repo_owner:,
      repo_name:,
      pull_request_number: pr.number,
      team_reviewers: ["moderators"]
      # team_reviewers: ["Benefactorum/moderators", "moderators"]
    )

    # Update the contribution with the PR URL
    contribution.update!(
      github_resource_url: pr.html_url,
      status: "en attente de validation"
    )
  rescue => e
    Rails.logger.error "Error creating GitHub PR for contribution #{contribution_id} on #{osbl_name}: #{e.message}"
    raise
  end

  private

  def generate_pr_body(contribution)
    body = ""
    if contribution.body.present?
      body += "### Description de la contribution\n\n"
      body += contribution.body
      body += "\n\n"
    end

    if contribution.files.attached?
      body += "### Fichiers joints\n\n"
      contribution.files.each do |file|
        body += "- [#{file.filename}](#{FileProcessor.generate_url(file)})\n"
      end
      body += "\n\n"
    end

    body += "### Actions via Benefactorum\n\n"
    body += "[Voir](#{contribution_url(contribution)})"
    body += " - "
    body += "[Modifier](#{edit_contribution_url(contribution)})"
  end
end
