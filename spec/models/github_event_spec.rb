require "rails_helper"

RSpec.describe GithubEvent, type: :model do
  describe "factory" do
    it "has a valid factory" do
      expect(build(:github_event)).to be_valid
    end
  end
end
