class OsblScraperService
  SECRET_KEY = Rails.application.credentials.dig(:firecrawl, :secret_key)

  def initialize(osbl_uri)
    @osbl_uri = normalize(osbl_uri)
    @firecrawl = Firecrawl.new(SECRET_KEY)
  end

  def call
    job_id = start_extract_async_job

    OsblScraperJob.set(wait: 5.seconds).perform_later(job_id, osbl_uri: @osbl_uri)

    job_id
  end

  private

  def normalize(uri)
    # Remove trailing slash from URI if present
    # e.g. "https://example.com/" -> "https://example.com"
    uri.gsub(/\/$/, "")
  end

  def start_extract_async_job
    response = @firecrawl.extract(
      urls: [@osbl_uri + "/*"],
      prompt: get_prompt,
      schema: osbl_schema,
      enable_web_search: true
    )

    if response["success"]
      response["id"]
    else
      raise "Failed to start extract job : #{response["error"]}"
    end
  end

  private

  def get_prompt
    <<~PROMPT
      You are tasked with extracting only verified, meaningful data from an OSBL website (a French non-profit organization). Follow these rules strictly and output JSON that exactly matches the provided schema. Do not fabricate defaults or include blank values.

      1. **Use only credible sources:** Only include a field if you have a reliable source backing it up.
      2. **Conform to the additional informations provided below:** Ensure your output follows requirements.
      3. **Do not fabricate defaults:** Do not include blank values.
      4. **Do not add duplicates:** Remove any duplicates or irrelevant data before outputting.
      5. **use French:** All output must be in French.

      **Additional informations:**

      - **description:** A concise summary (max 300 characters) of the organization's mission and actions, in French.
      - **logo:** A URL to a high-quality logo image (SVG, PNG, or WEBP) with a transparent background, suitable for 200x200px display.
      - **tax_reduction:** One of: #{Osbl.tax_reductions.keys.join(", ")}. Indicates if donations yield a 66% (intérêt général) or 75% (aide aux personnes en difficulté) tax deduction.
      - **geographical_scale:** One of: #{Osbl.geographical_scales.keys.join(", ")}. Defines the operational scope of the organization.
      - **osbl_type:** One of: #{Osbl.osbl_types.keys.join(", ")}.
      - **public_utility:** True if the organization is ARUP or FRUP (reconnue d'utilité publique); note that "reconnue d’intérêt général" is not considered as a public utility.
      - **osbls_causes_attributes:** Up to 3 causes maximum. Each cause name must be in: #{Osbl::Cause::LIST}. Fewer is better than irrelevant extras.
      - **osbls_keywords_attributes:** Up to 5 precise keywords capturing the organization's specifics. Avoid generic terms like "Sensibilisation" or "Solidarité".
      - **osbls_intervention_areas_attributes:** Specific geographical areas (countries, regions, continents) where the organization operates. Exclude vague terms like "worldwide" or "international" and avoid listing 'France' for national OSBLs.
      - **osbls_labels_attributes:** Include only if there is a valid, official label logo (e.g., "Don en Confiance", "label IDEAS").
      - **annual_finances_attributes:** Only include financial data from the last 5 years. For each entry:
        - **year:** The fiscal year.
        - **fund_sources_attributes:** Each entry must have a type (one of: #{Osbl::FundSource.types.keys.join(", ")}).
        - **fund_allocations_attributes:** Each entry must have a type (one of: #{Osbl::FundAllocation.types.keys.join(", ")}).
      - **document_attachments_attributes:** Each document must be one of type: #{Document.types.except("Autre").keys.join(", ")}.
      - **locations_attributes:** Only include if the address have at least a city. Ensure only one location is marked as "Siège social" and that the type is one of: #{Osbl::Location.types.keys.join(", ")}.

    PROMPT
  end

  def osbl_schema
    {
      type: "object",
      properties: {
        name: {
          type: "string"
        },
        website: {
          type: "string"
        },
        logo: {
          type: "string"
        },
        description: {
          type: "string"
        },
        tax_reduction: {
          type: "string"
        },
        geographical_scale: {
          type: "string"
        },
        osbl_type: {
          type: "string"
        },
        public_utility: {
          type: "boolean"
        },
        creation_year: {
          type: "number"
        },
        osbls_causes_attributes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              }
            },
            required: [
              "name"
            ]
          }
        },
        osbls_keywords_attributes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              }
            }
          },
          required: [
            "name"
          ]
        },
        osbls_intervention_areas_attributes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              }
            },
            required: [
              "name"
            ]
          }
        },
        osbls_labels_attributes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string"
              }
            },
            required: [
              "name"
            ]
          }
        },
        annual_finances_attributes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              year: {
                type: "number"
              },
              certified: {
                type: "boolean"
              },
              budget: {
                type: "number"
              },
              treasury: {
                type: "number"
              },
              employees_count: {
                type: "number"
              },
              fund_sources_attributes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string"
                    },
                    percent: {
                      type: "number"
                    },
                    amount: {
                      type: "number"
                    }
                  }, required: [
                    "type",
                    "percent"
                  ]
                }
              },
              fund_allocations_attributes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string"
                    },
                    percent: {
                      type: "number"
                    },
                    amount: {
                      type: "number"
                    }
                  }, required: [
                    "type",
                    "percent"
                  ]
                }
              }
            },
            required: [
              "year"
            ]
          }
        },
        document_attachments_attributes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              document_attributes: {
                type: "object",
                properties: {
                  type: {
                    type: "string"
                  },
                  file: {
                    type: "string"
                  },
                  name: {
                    type: "string"
                  },
                  year: {
                    type: "number"
                  },
                  description: {
                    type: "string"
                  }
                },
                required: [
                  "type",
                  "file"
                ]
              }
            }
          }
        },
        locations_attributes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string"
              },
              address_attributes: {
                type: "object",
                properties: {
                  street_number: {
                    type: "string"
                  },
                  street_name: {
                    type: "string"
                  },
                  additional_info: {
                    type: "string"
                  },
                  postal_code: {
                    type: "string"
                  },
                  city: {
                    type: "string"
                  }
                },
                required: [
                  "street_name",
                  "postal_code",
                  "city"
                ]
              },
              name: {
                type: "string"
              },
              description: {
                type: "string"
              },
              website: {
                type: "string"
              }
            },
            required: [
              "type",
              "address_attributes"
            ]
          }
        }
      },
      required: [
        "name",
        "tax_reduction",
        "osbls_causes_attributes"
      ]
    }
  end
end
