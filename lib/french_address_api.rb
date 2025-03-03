class FrenchAddressApi
  API_BASE = "https://api-adresse.data.gouv.fr"

  class APIError < StandardError; end

  # INPUT: query: The query to search for.
  # OUTPUT
  # {
  #   [...], # other keys
  #   "features": [
  #     {
  #       "properties": {
  #         "label": "123 Rue de la Paix, 75000 Paris",
  #         "housenumber": "123",
  #         "street": "Rue de la Paix",
  #         "postcode": "75000",
  #         "city": "Paris",
  #         [...], # other keys
  #       },
  #       "geometry": {
  #         "coordinates": [2.345678, 48.856613]
  #       }
  #     },
  #     [...], # other features
  #   ]
  # }
  def self.search(query)
    uri = URI("#{API_BASE}/search")
    uri.query = URI.encode_www_form(q: query)

    request = Net::HTTP::Get.new(uri)

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    JSON.parse(response.body)
  rescue JSON::ParserError, Net::ReadTimeout, Net::OpenTimeout, SocketError => e
    raise APIError, "API request failed: #{e.message}"
  end
end
