require "faraday/retry"

# Configure Octokit to use Faraday retry middleware
Octokit.configure do |c|
  c.middleware = Faraday::RackBuilder.new do |builder|
    builder.use Faraday::Retry::Middleware, exceptions: [Octokit::ServerError, Octokit::ClientError]
    builder.adapter Faraday.default_adapter
  end
end
