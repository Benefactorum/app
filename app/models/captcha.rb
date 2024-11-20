require "net/http"
require "uri"
require "json"

class Captcha
  SECRET_KEY = Rails.application.credentials.recaptcha[:secret_key]

  def initialize(token)
    @token = token
  end

  def valid?
    response = Net::HTTP.post_form(
      URI.parse("https://www.google.com/recaptcha/api/siteverify"),
      {
        "secret" => SECRET_KEY,
        "response" => @token
      }
    )
    result = JSON.parse(response.body)
    !!result["success"]
  end
end
