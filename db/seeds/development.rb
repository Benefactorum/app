logo = ActiveStorage::Blob.create_and_upload!(
  io: Rails.root.join("app/frontend/assets/logo.svg").open,
  filename: "logo.svg",
  content_type: "image/svg+xml"
)

document1 = ActiveStorage::Blob.create_and_upload!(
  io: Rails.root.join("spec/fixtures/files/sample.pdf").open,
  filename: "sample.pdf",
  content_type: "application/pdf"
)

document2 = ActiveStorage::Blob.create_and_upload!(
  io: Rails.root.join("spec/fixtures/files/sample.pdf").open,
  filename: "sample.pdf",
  content_type: "application/pdf"
)

benefactorum_params = {
  "name" => "Benefactorum",
  "website" => "https://benefactorum.org/",
  "logo" => logo.signed_id,
  # {
  #   "tempfile" => "#<File:0x00007836ee3e6f50>",
  #   "content_type" => "image/png",
  #   "original_filename" => "Benefactorum-Logo.png",
  #   "headers" => "Content-Disposition: form-data; name=\"logo\"; filename=\"Benefactorum-Logo.png\"\r\nContent-Type: image/png\r\n"
  # },
  "description" =>
    "Benefactorum est la première plateforme de dons\r\ncollaborative et à but non-lucratif,\r\nqui vous permet de découvrir et de soutenir facilement\r\ntoutes les causes qui vous tiennent à coeur !",
  "osbls_causes_attributes" => {
    "0" => {
      "cause_id" => Osbl::Cause.find_by!(name: "Autre").id.to_s,
      "name" => "Autre"
    }
  },
  "tax_reduction" => "intérêt_général",
  "osbls_keywords_attributes" => {
    "0" => {
      "keyword_id" => Osbl::Keyword.find_by!(name: "Altruisme").id.to_s,
      "name" => "Altruisme"
    },
    "1" => {
      "keyword_id" => Osbl::Keyword.find_by!(name: "Donateurs").id.to_s,
      "name" => "Donateurs"
    },
    "2" => {
      "keyword_id" => Osbl::Keyword.find_by!(name: "Plateforme de dons").id.to_s,
      "name" => "Plateforme de dons"
    },
    "3" => {
      "keyword_id" => Osbl::Keyword.find_by!(name: "Web").id.to_s,
      "name" => "Web"
    }
  },
  "osbls_intervention_areas_attributes" => {
    "0" => {
      "intervention_area_id" => Osbl::InterventionArea.find_by!(name: "Paris").id.to_s,
      "name" => "Paris"
    },
    "1" => {
      "intervention_area_id" => Osbl::InterventionArea.find_by!(name: "France").id.to_s,
      "name" => "France"
    }
  },
  "geographical_scale" => "national",
  "osbl_type" => "association",
  "creation_year" => 2023,
  "document_attachments_attributes" =>
    {
      "0" =>
      {
        "document_attributes" =>
        {
          "type" => "Statuts",
          "file" => document1.signed_id,
          #  {
          #    "tempfile" => "#<File:0x00007836eea1e8f0>",
          #    "content_type" => "application/pdf",
          #    "original_filename" => "Statuts Benefactorum.pdf",
          #    "headers" => "Content-Disposition: form-data; name=\"document_attachments_attributes[0][document_attributes][file]\"; filename=\"Statuts Benefactorum.pdf\"\r\nContent-Type: application/pdf\r\n"
          #  },
          "name" => "Statuts de l'association",
          "year" => 2023
        }
      },
      "1" =>
      {
        "document_attributes" =>
        {
          "type" => "Statuts",
          "file" => document2.signed_id,
          #  {
          #    "tempfile" => "#<File:0x00007836eea10c28>",
          #    "content_type" => "application/pdf",
          #    "original_filename" => "Statuts - Fonds Benefactorum.pdf",
          #    "headers" =>
          #    "Content-Disposition: form-data; name=\"document_attachments_attributes[1][document_attributes][file]\"; filename=\"Statuts - Fonds Benefactorum.pdf\"\r\nContent-Type: application/pdf\r\n"
          #  },
          "name" => "Statuts du fonds de dotation",
          "year" => 2023
        }
      }
    },
  "locations_attributes" =>
    {
      "0" =>
      {
        "type" => "Siège social",
        "address_attributes" => {
          "street_number" => "12",
          "street_name" => "Rue du moulin",
          "postal_code" => "44260",
          "city" => "La Chapelle-Launay",
          "latitude" => "47.371354",
          "longitude" => "-1.969269"
        }
      }
    }
}

user = User.find_or_create_by!(email: "test@test.com") do |u|
  u.first_name = "Alain"
  u.last_name = "Connu"
  u.terms_and_privacy_accepted_at = Time.current
end
user.create_otp!

user.contributions.create_or_find_by!(contributable: Contribution::OsblCreation.new(osbl_data: benefactorum_params))

# Osbl.find_or_create_by!(name: benefactorum_params["name"]) do |osbl|
#   osbl.assign_attributes(benefactorum_params)
# end
