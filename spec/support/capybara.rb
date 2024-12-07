require "capybara/rspec"

Capybara.register_driver :remote_chrome do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument("--headless")
  options.add_argument("--no-sandbox")
  options.add_argument("--disable-dev-shm-usage")
  options.add_argument("--window-size=1400,1400")

  Capybara::Selenium::Driver.new(
    app,
    browser: :remote,
    url: "http://selenium:4444/wd/hub",
    capabilities: options
  )
end

Capybara.javascript_driver = :remote_chrome
Capybara.save_path = Rails.root.join("tmp/screenshots")

RSpec.configure do |config|
  config.before(:each, type: :system) do
    if ENV["SELENIUM_REMOTE_HOST"]
      Capybara.server_host = "0.0.0.0"
      Capybara.server_port = 3001
      Capybara.app_host = "http://benefactorum:3001"
      driven_by :remote_chrome
    else
      driven_by :selenium, using: :headless_chrome
    end
  end
end
