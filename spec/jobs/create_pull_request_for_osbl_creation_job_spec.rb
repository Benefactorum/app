require "rails_helper"

RSpec.describe CreatePullRequestForOsblCreationJob, type: :job do
  let(:user) { create(:user) }
  let(:cause) { create(:cause) }
  let(:file) do
    ActiveStorage::Blob.create_and_upload!(
      io: Rails.root.join("spec/fixtures/files/sample.pdf").open,
      filename: "sample.pdf",
      content_type: "application/pdf"
    )
  end

  let(:contribution) do
    create(:contribution, :osbl_creation,
      user: user,
      body: "This is a test contribution description",
      files: [file],
      contributable: build(:osbl_creation, osbl_data: {
        name: "Test OSBL 18",
        description: "This is a test OSBL",
        tax_reduction: "intérêt_général",
        osbls_causes_attributes: [{cause_id: cause.id}]
      }))
  end

  describe "#perform" do
    it "creates a pull request for the OSBL contribution and assigns it to moderators" do
      VCR.use_cassette("github/create_pull_request_for_osbl_creation") do
        expect {
          described_class.perform_now(contribution.id)
        }.to change { contribution.reload.status }.from("brouillon").to("en attente de validation")
          .and change { contribution.reload.github_resource_url }.from(nil).to(a_string_matching(/github\.com/))

        # Verify the PR was assigned to moderators team
        pr_url = contribution.reload.github_resource_url
        pr_number = pr_url.split("/").last
        pr = Octokit.pull_request("Benefactorum/contributions", pr_number)
        expect(pr.requested_teams.map(&:slug)).to include("moderators")
      end
    end
  end
end
