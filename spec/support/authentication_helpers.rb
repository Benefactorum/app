RSpec.configure do
  def sign_in_as(user)
    post sessions_path, params: {email: user.email, code: user.otp}
  end

  # capybara
  def connect_as(user)
    visit new_connection_path
    fill_in "Votre adresse email", with: user.email
    click_button "Continuer"
    fill_in "OTP", with: user.otp
    click_button "Continuer"
    expect(page).to have_text("connecté")
  end
end
