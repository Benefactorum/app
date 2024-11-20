# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3100/rails/mailers/user_mailer/otp
  def otp
    user = User.first
    UserMailer.with(user: user, otp: user.otp).otp
  end
end