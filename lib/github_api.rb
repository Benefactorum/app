class GithubApi
  def initialize(app_id:, private_key:, installation_id:)
    @app_id = app_id
    @private_key = private_key
    @installation_id = installation_id
    @client = github_installation_client
  end

  def create_pull_request(repo_owner:, repo_name:, title:, body:, head_branch:, base_branch: "main")
    @client.create_pull_request(
      "#{repo_owner}/#{repo_name}",
      base_branch,
      head_branch,
      title,
      body
    )
  end

  def request_pull_request_review(repo_owner:, repo_name:, pull_request_number:, team_reviewers:)
    @client.request_pull_request_review(
      "#{repo_owner}/#{repo_name}",
      pull_request_number,
      team_reviewers:
    )
  end

  def create_commit_on_new_branch(repo_owner:, repo_name:, new_branch_name:, commit_message:, file_path:, file_content:, base_branch: "main")
    # Get the reference to the base branch
    ref = @client.ref("#{repo_owner}/#{repo_name}", "heads/#{base_branch}")
    base_sha = ref.object.sha

    # Create a new branch from the base branch
    created_ref = @client.create_ref(
      "#{repo_owner}/#{repo_name}",
      "refs/heads/#{new_branch_name}",
      base_sha
    )
    raise created_ref.message if created_ref.status == "422"

    # Create or update the file in the new branch
    @client.create_contents(
      "#{repo_owner}/#{repo_name}",
      file_path,
      commit_message,
      file_content,
      branch: new_branch_name
    )
  end

  private

  def github_app_client
    @github_app_client ||= Octokit::Client.new(
      bearer_token: generate_jwt
    )
  end

  def github_installation_client
    @github_installation_client ||= begin
      token = github_app_client.create_app_installation_access_token(@installation_id)[:token]
      Octokit::Client.new(bearer_token: token)
    end
  end

  def generate_jwt
    private_key = OpenSSL::PKey::RSA.new(@private_key)

    payload = {
      iat: Time.now.to_i,           # Issued at time
      exp: Time.now.to_i + 10 * 60, # JWT expires in 10 minutes
      iss: @app_id                  # GitHub App ID
    }

    JWT.encode(payload, private_key, "RS256")
  end
end
