# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

causes = [
  "environnement",
  "protection-de-l-enfance",
  "sante",
  "lutte-contre-la-précarité",
  "education",
  "protection-animale",
  "recherche",
  "arts-culture-patrimoine",
  "aide-internationale",
  "handicap",
  "justice-sociale",
  "religion",
  "autre"
]

causes.each do |cause|
  Cause.find_or_create_by!(name: cause)
end
