class Document < ApplicationRecord
  has_one_attached :file

  belongs_to :contribution
  belongs_to :osbl, optional: true

  enum :type, {basic_attachment: 0, logo: 1, association_statutes: 2, activity_report: 3, other: 4}
end
