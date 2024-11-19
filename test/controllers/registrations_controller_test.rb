require "test_helper"

class RegistrationsControllerTest < ActionDispatch::IntegrationTest
  include ActiveSupport::Testing::TimeHelpers

  test "#new" do
    get new_registration_url
    assert_response :success
  end

  test "#create" do
    freeze_time
    assert_difference("User.count") do
      post registrations_path, params: { email: "lazaronixon@hey.com", first_name: "Lazaro", last_name: "Nixon", accepts_conditions: true }
    end

    user = User.find_by(email: "lazaronixon@hey.com")
    assert_equal "Lazaro", user.first_name
    assert_equal "Nixon", user.last_name
    assert_equal user.terms_and_privacy_accepted_at, Time.current
  end

  test "#create with invalid params" do
    skip
    assert_no_difference("User.count") do
      post registrations_path, params: { email: "invalid", first_name: "", last_name: "", accepts_conditions: false }
    end
    assert_redirected_to new_registration_path

    # inertia_errors = JSON.parse(response.body)["props"]["errors"]
    # # assert_not_empty inertia_errors
    # # assert_equal [ "is invalid" ], inertia_errors["email"]
  end
end
