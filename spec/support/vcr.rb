require "vcr"
require "webmock/rspec"

VCR.configure do |config|
  config.cassette_library_dir = "spec/vcr_cassettes"
  config.hook_into :webmock

  # Configure VCR to use RSpec metadata - only for tests tagged with :vcr
  config.configure_rspec_metadata!

  # Filter out sensitive information
  config.filter_sensitive_data("<FIRECRAWL_SECRET_KEY>") { Rails.application.credentials.dig(:firecrawl, :secret_key) }

  # Filter GitHub credentials
  config.filter_sensitive_data("<GITHUB_APP_ID>") { Rails.application.credentials.dig(:github, :app_id) }
  config.filter_sensitive_data("<GITHUB_INSTALLATION_ID>") { Rails.application.credentials.dig(:github, :installation_id) }
  config.filter_sensitive_data("<GITHUB_PRIVATE_KEY>") { Rails.application.credentials.dig(:github, :private_key)&.to_s&.gsub("\n", "\\n") }
  # Filter installation tokens
  config.filter_sensitive_data("<GITHUB_INSTALLATION_TOKEN>") do |interaction|
    interaction.response.body.to_s.scan(/"token":\s*"([^"]+)"/).flatten.first
  end
  # Filter GitHub tokens in authorization headers
  config.filter_sensitive_data("<GITHUB_TOKEN>") do |interaction|
    auth_header = interaction.request.headers["Authorization"]&.first
    if auth_header&.match(/^Bearer (.*)$/)
      $1
    end
  end

  # Allow localhost requests to go through (useful for development)
  config.ignore_localhost = true

  # Ignore Selenium WebDriver requests
  config.ignore_hosts "selenium", "127.0.0.1", "localhost"

  # Set default recording mode
  config.default_cassette_options = {
    record: :once,
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
