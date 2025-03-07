require "rails_helper"

RSpec.describe GithubApi do
  let(:app_id) { Rails.application.credentials.github[:app_id] }
  let(:private_key) { Rails.application.credentials.github[:private_key] }
  let(:installation_id) { Rails.application.credentials.github[:installation_id] }
  let(:github_api) { described_class.new(app_id: app_id, private_key: private_key, installation_id: installation_id) }

  let(:repo_owner) { "Benefactorum" }
  let(:repo_name) { "contributions" }
  let(:test_branch_name) { "test_branch_4" }
  let(:test_file_path) { "test_file.json" }
  let(:test_file_content) { JSON.pretty_generate({test: "content"}) }

  describe "#create_commit_on_new_branch", :vcr do
    it "creates a new branch with a commit" do
      response = github_api.create_commit_on_new_branch(
        repo_owner: repo_owner,
        repo_name: repo_name,
        new_branch_name: test_branch_name,
        commit_message: "Test commit",
        file_path: test_file_path,
        file_content: test_file_content
      )

      expect(response).to be_a(Sawyer::Resource)
      expect(response.content).to be_a(Sawyer::Resource)
      expect(response.commit).to be_a(Sawyer::Resource)
      expect(response.commit.message).to eq("Test commit")
    end
  end

  describe "#create_pull_request", :vcr do
    let(:test_branch_name) { "test_branch_5" }
    # First create a branch for testing
    before do
      github_api.create_commit_on_new_branch(
        repo_owner: repo_owner,
        repo_name: repo_name,
        new_branch_name: test_branch_name,
        commit_message: "Test setup commit",
        file_path: test_file_path,
        file_content: test_file_content
      )
    end

    it "creates a pull request" do
      response = github_api.create_pull_request(
        repo_owner: repo_owner,
        repo_name: repo_name,
        title: "Test PR",
        body: "Test PR body",
        head_branch: test_branch_name
      )

      expect(response).to be_a(Sawyer::Resource)
      expect(response.title).to eq("Test PR")
      expect(response.body).to eq("Test PR body")
      expect(response.head.ref).to eq(test_branch_name)
      expect(response.base.ref).to eq("main")
    end
  end
end
