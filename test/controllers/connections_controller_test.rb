require "test_helper"

class ConnectionsControllerTest < ActionDispatch::IntegrationTest
  test "#new" do
    get new_connection_url
    assert_response :success
  end

  test "#create redirects back with errors if no email is provided" do
    post connections_url, params: { email: "" }
    assert_redirected_to new_connection_url
  end

  test "#create redirects to new_registration for unknown user" do
    assert_no_emails do
      post connections_url, params: { email: "unknown@mail.com" }
    end
    assert_redirected_to new_registration_url
  end

  test "#create redirects to sign_in for known user" do
    user = users(:first_new_registration_user)
    assert_enqueued_emails 1 do
      post connections_url, params: { email: user.email }
    end
    user.reload
    otp = ROTP::HOTP.new(user.otp_secret).at(user.otp_counter)
    assert_enqueued_email_with UserMailer, :otp, params: { user: user, otp: otp }
    assert_redirected_to sign_in_url
    # Second time should not send email as otp is still valid
    assert_enqueued_emails 0 do
      post connections_url, params: { email: user.email }
    end
  end

  test "#resend_otp send mail and redirects to sign_in" do
    user = users(:first_new_registration_user)
    assert_enqueued_emails 1 do
      post resend_otp_connections_url, params: { email: user.email }
    end
    user.reload
    otp_1 = ROTP::HOTP.new(user.otp_secret).at(user.otp_counter)
    assert_enqueued_email_with UserMailer, :otp, params: { user: user, otp: otp_1 }
    assert_redirected_to sign_in_url
    # Second time should still send email as otp expiration_check is bypassed
    assert_enqueued_emails 1 do
      post resend_otp_connections_url, params: { email: user.email }
    end
    user.reload
    otp_2 = ROTP::HOTP.new(user.otp_secret).at(user.otp_counter)
    assert_enqueued_email_with UserMailer, :otp, params: { user: user, otp: otp_2 }
    assert_not_equal otp_1, otp_2
  end

  test "#resend_otp redirects to new_connection if user is not found" do
    assert_no_emails do
      post resend_otp_connections_url, params: { email: "unknown@mail.com" }
    end
    assert_redirected_to new_connection_url
  end
end
