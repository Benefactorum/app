require "vcr"
require "webmock/rspec"

VCR.configure do |config|
  config.cassette_library_dir = "spec/vcr_cassettes"
  config.hook_into :webmock

  # Configure VCR to use RSpec metadata - only for tests tagged with :vcr
  config.configure_rspec_metadata!

  # Filter out sensitive information
  config.filter_sensitive_data("<FIRECRAWL_SECRET_KEY>") { Rails.application.credentials.dig(:firecrawl, :secret_key) }

  # Allow localhost requests to go through (useful for development)
  config.ignore_localhost = true

  # Ignore Selenium WebDriver requests
  config.ignore_hosts "selenium", "127.0.0.1", "localhost"

  # Set default recording mode
  config.default_cassette_options = {
    record: :new_episodes,
    match_requests_on: [:method, :uri, :body],
    allow_playback_repeats: true
  }
end

# Configure WebMock to allow non-VCR requests by default
WebMock.allow_net_connect!

# Only enable WebMock disabling of real requests when using VCR
RSpec.configure do |config|
  config.around(:each) do |example|
    if example.metadata[:vcr]
      WebMock.disable_net_connect!(allow_localhost: true, allow: ["selenium", "127.0.0.1", "localhost"])
      example.run
      WebMock.allow_net_connect!
    else
      WebMock.allow_net_connect!
      example.run
    end
  end
end
