RSpec.configure do
  def sign_in_as(user)
    post sessions_path, params: {email: user.email, code: user.otp}
  end
end
