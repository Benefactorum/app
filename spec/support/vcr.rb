require "vcr"
require "webmock/rspec"

VCR.configure do |config|
  config.cassette_library_dir = "spec/vcr_cassettes"
  config.hook_into :webmock
  config.configure_rspec_metadata!

  # Filter out sensitive information
  config.filter_sensitive_data("<FIRECRAWL_SECRET_KEY>") { Rails.application.credentials.dig(:firecrawl, :secret_key) }

  # Allow localhost requests to go through (useful for development)
  config.ignore_localhost = true

  # Set default recording mode
  config.default_cassette_options = {
    record: :once,
    match_requests_on: [:method, :uri, :body],
    allow_playback_repeats: true
  }
end
