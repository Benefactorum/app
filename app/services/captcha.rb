class Captcha
  SECRET_KEY = Rails.application.credentials.dig(:recaptcha, :secret_key)

  def initialize(token)
    @token = token
  end

  def valid?
    return true if Rails.env.development?

    response = Net::HTTP.post_form(
      URI.parse("https://www.google.com/recaptcha/api/siteverify"),
      {
        "secret" => SECRET_KEY,
        "response" => @token
      }
    )
    result = JSON.parse(response.body)
    !!result["success"]
  rescue => e
    Rails.logger.error "Captcha validation error: #{e.message}"
    false
  end
end
