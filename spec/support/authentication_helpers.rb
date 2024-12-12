RSpec.configure do
  def sign_in_as(user)
    session = user.sessions.create!
    allow_any_instance_of(ActionDispatch::Cookies::CookieJar).to receive(:signed).and_return({session_token: session.id})
  end

  # capybara
  def connect_as(user)
    visit new_connection_path
    fill_in "Votre adresse email", with: user.email
    click_button "Continuer"
    fill_in "OTP", with: user.otp.code
    click_button "Continuer"
    expect(page).to have_text("connecté")
  end
end
