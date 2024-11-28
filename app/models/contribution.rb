class Contribution < ApplicationRecord
  belongs_to :user
  delegated_type :contributable, types: %w[OsblProposal Comment]

  enum :status, {pending: 0, submitted: 1, approved: 2, rejected: 3}
end
