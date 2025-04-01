require "rails_helper"

RSpec.describe "Users::Contributions::Submissions", type: :request, inertia: true do
  describe "POST /users/:user_id/contributions/:contribution_id/submission" do
    subject { post user_contribution_submission_path(user, contribution) }

    let(:user) { create(:user) }
    let(:contribution) { create(:contribution, user:) }

    it_behaves_like "require_authentication"

    context "when authenticated" do
      before { sign_in_as(user) }

      context "when the contribution belongs to the user" do
        it "updates the contribution status" do
          expect { subject }.to change { contribution.reload.status }
            .from(contribution.status)
            .to("en cours d'envoi")
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
