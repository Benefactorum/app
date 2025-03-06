require "rails_helper"

RSpec.describe "Contributions::Submissions", type: :request, inertia: true do
  describe "POST /contributions/:contribution_id/submission" do
    subject { post contribution_submission_path(contribution) }

    let(:user) { create(:user) }
    let(:contribution) { create(:contribution, user:) }

    it_behaves_like "require_authentication"

    context "when authenticated" do
      before { sign_in_as(user) }

      context "when the contribution belongs to the user" do
        it "updates the contribution status to 'en attente de revue'" do
          expect { subject }.to change { contribution.reload.status }
            .from(contribution.status)
            .to("en attente de revue")
        end

        it "redirects to my contributions path" do
          subject
          expect(response).to redirect_to(my_contributions_path)
        end
      end

      context "when the contribution belongs to another user" do
        let(:other_user) { create(:user) }
        let(:contribution) { create(:contribution, user: other_user) }

        it "does not modify the contribution status" do
          expect { subject }.not_to change { contribution.reload.status }
        end

        it "returns not_found" do
          subject
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end
end
