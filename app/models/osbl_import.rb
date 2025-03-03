class OsblImport < ApplicationRecord
  belongs_to :user

  belongs_to :contribution, optional: true

  validates :osbl_uri, format: {with: URI::RFC2396_PARSER.make_regexp(%w[http https])}

  enum :status, {
    initialized: 0,
    cancelled: 1,
    failed: 2,
    timed_out: 3,
    extracted: 4,
    completed: 5
  }.freeze
end
