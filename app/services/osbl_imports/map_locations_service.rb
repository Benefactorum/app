module OsblImports
  class MapLocationsService
    def self.call(locations)
      new(locations).call
    end

    def initialize(locations)
      @locations = locations
      @processed_addresses = Set.new
    end

    def call
      return nil if @locations.blank?

      @locations.map do |location|
        confirmed_address = get_confirmed_address(location)
        next unless valid_address?(confirmed_address)

        address_attributes = extract_address_attributes(confirmed_address)
        full_address = build_full_address(address_attributes)

        # Skip duplicate addresses
        next if @processed_addresses.include?(full_address)
        @processed_addresses.add(full_address)

        {
          "type" => location["type"],
          "address_attributes" => address_attributes
        }
      end.compact
    end

    private

    def valid_address?(confirmed_address)
      return false unless confirmed_address
      return false if confirmed_address["properties"]["street"].blank?
      return false if confirmed_address["properties"]["postcode"].blank?
      return false if confirmed_address["properties"]["city"].blank?
      true
    end

    def extract_address_attributes(confirmed_address)
      {
        "street_number" => confirmed_address["properties"]["housenumber"],
        "street_name" => confirmed_address["properties"]["street"],
        "postal_code" => confirmed_address["properties"]["postcode"],
        "city" => confirmed_address["properties"]["city"],
        "latitude" => confirmed_address["geometry"]["coordinates"][1],
        "longitude" => confirmed_address["geometry"]["coordinates"][0]
      }
    end

    def build_full_address(address_attributes)
      [
        address_attributes["street_number"],
        address_attributes["street_name"],
        address_attributes["postal_code"],
        address_attributes["city"]
      ].compact.join(" ").downcase
    end

    def get_confirmed_address(location, retries = 0)
      full_address = build_address_from_location(location)
      return if full_address.blank?

      results = FrenchAddressApi.search(full_address)

      if results["features"].any? && results["features"].first["properties"]["score"] >= 0.9
        results["features"].first
      end
    rescue FrenchAddressApi::ApiError
      handle_address_api_retry(location, retries)
    rescue => e
      Rails.logger.error(e.message)
      nil
    end

    def build_address_from_location(location)
      address_attrs = location["address_attributes"]
      [
        address_attrs["street_number"],
        address_attrs["street_name"],
        address_attrs["additional_info"],
        address_attrs["postal_code"],
        address_attrs["city"]
      ].join(" ")
    end

    def handle_address_api_retry(location, retries)
      retries += 1
      sleep retries
      if retries < 3
        get_confirmed_address(location, retries)
      else
        Rails.logger.error("Failed to get confirmed address after retries")
        nil
      end
    end
  end
end
