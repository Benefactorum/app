# Be sure to restart your server when you modify this file.

if Rails.env.production?
  # Configure parameters to be partially matched (e.g. passw matches password) and filtered from the log file.
  # Use this to limit dissemination of sensitive information.
  # See the ActiveSupport::ParameterFilter documentation for supported notations and behaviors.
  Rails.application.config.filter_parameters += [
    :passw, :email, :secret, :token, :_key, :crypt, :salt, :certificate, :otp_secret, :ssn, :cvv, :cvc, :first_name, :last_name
  ]
end
