class GithubEvent < ApplicationRecord
  belongs_to :contribution, optional: true
  # validates :event, presence: true
  # validates :payload, presence: true

  enum :status, {
    pending: "pending",
    processed: "processed",
    ignored: "ignored"
  }
end
