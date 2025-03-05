# https://docs.firecrawl.dev/api-reference/endpoint/extract
class Firecrawl
  API_BASE = "https://api.firecrawl.dev"
  API_VERSION = "v1"

  def initialize(secret_key)
    @secret_key = secret_key
  end

  # INPUT: urls: An array of one or more URLs. Supports wildcards (/*) for broader crawling.
  # OUTPUT: {
  #   "success": true,
  #   "id": "<string>"
  # }
  def extract(urls:, prompt: nil, schema: nil, enable_web_search: false, show_sources: false)
    uri = URI("#{API_BASE}/#{API_VERSION}/extract")
    request = Net::HTTP::Post.new(uri)
    request["Authorization"] = "Bearer #{@secret_key}"
    request["Content-Type"] = "application/json"

    payload = {urls: urls}
    payload[:prompt] = prompt if prompt
    payload[:schema] = schema if schema
    payload[:enableWebSearch] = enable_web_search if enable_web_search
    payload[:showSources] = show_sources if show_sources

    request.body = payload.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    JSON.parse(response.body)
  rescue => e
    Rails.logger.error("Firecrawl API error for extract #{urls}: #{e.message}")
    raise e
  end

  # INPUT: job_id: The job ID of the extraction job.
  # OUTPUT: {
  #   "success": true,
  #   "data": {},
  #   "status": "completed",
  #   "expiresAt": "2023-11-07T05:31:56Z"
  # }
  def get_extract_status(job_id)
    uri = URI("#{API_BASE}/#{API_VERSION}/extract/#{job_id}")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{@secret_key}"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    JSON.parse(response.body)
  rescue => e
    Rails.logger.error("Firecrawl API error for get_extract_status #{job_id}: #{e.message}")
    raise e
  end
end
