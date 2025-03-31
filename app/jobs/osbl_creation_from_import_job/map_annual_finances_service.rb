class OsblCreationFromImportJob
  class MapAnnualFinancesService
    def self.call(annual_finances)
      new(annual_finances).call
    end

    def initialize(annual_finances)
      @annual_finances = annual_finances
    end

    def call
      return nil if @annual_finances.blank?

      grouped_by_year = group_finances_by_year
      unique_years = select_most_complete_entries(grouped_by_year)

      unique_years.map do |year, annual_finance|
        computed_annual_finance = {
          "year" => year,
          "budget" => annual_finance["budget"],
          "treasury" => annual_finance["treasury"],
          "certified" => annual_finance["certified"],
          "employees_count" => annual_finance["employees_count"],
          "fund_sources_attributes" => process_fund_sources(annual_finance["fund_sources_attributes"]),
          "fund_allocations_attributes" => process_fund_allocations(annual_finance["fund_allocations_attributes"])
        }.compact

        next if computed_annual_finance.except("year").empty?

        computed_annual_finance
      end.compact
    end

    private

    def group_finances_by_year
      @annual_finances.group_by { |af| af["year"] }
    end

    def select_most_complete_entries(grouped_by_year)
      grouped_by_year.transform_values do |entries|
        entries.max_by { |entry| calculate_entry_completeness_score(entry) }
      end
    end

    def calculate_entry_completeness_score(entry)
      # Base score from counting all non-blank values in the entry
      base_score = entry.count { |key, value| value.present? }

      # Add bonus points for valid fund sources and allocations
      fund_sources_score = calculate_fund_sources_score(entry["fund_sources_attributes"])
      fund_allocations_score = calculate_fund_allocations_score(entry["fund_allocations_attributes"])

      # Return total score
      base_score + fund_sources_score + fund_allocations_score
    end

    def calculate_fund_sources_score(fund_sources)
      return 0 if fund_sources.blank?

      total_percent = fund_sources.sum { |s| s["percent"].to_d }
      return 0 unless total_percent == 100

      fund_sources.sum { |source| source.count { |k, v| v.present? } }
    end

    def calculate_fund_allocations_score(fund_allocations)
      return 0 if fund_allocations.blank?

      total_percent = fund_allocations.sum { |a| a["percent"].to_d }
      return 0 unless total_percent == 100

      fund_allocations.sum { |allocation| allocation.count { |k, v| v.present? } }
    end

    # Fund sources processing
    def process_fund_sources(sources)
      return nil if sources.blank?

      unique_sources = extract_unique_by_type(sources)
      total_percent = calculate_total_percent(unique_sources)

      # Only include if total is 100%
      return nil unless total_percent == 100

      unique_sources.map do |source|
        {
          "type" => source["type"],
          "amount" => source["amount"],
          "percent" => source["percent"]
        }
      end
    end

    # Fund allocations processing
    def process_fund_allocations(allocations)
      return nil if allocations.blank?

      unique_allocations = extract_unique_by_type(allocations)
      total_percent = calculate_total_percent(unique_allocations)

      # Only include if total is 100%
      return nil unless total_percent == 100

      unique_allocations.map do |allocation|
        {
          "type" => allocation["type"],
          "amount" => allocation["amount"],
          "percent" => allocation["percent"]
        }
      end
    end

    def extract_unique_by_type(items)
      grouped_by_type = items.group_by { |item| item["type"] }
      grouped_by_type.transform_values(&:first).values
    end

    def calculate_total_percent(items)
      items.sum { |item| item["percent"].to_d }
    end
  end
end
