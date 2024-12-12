class UserMailer < ApplicationMailer
  def password_reset
    @user = params[:user]
    @signed_id = @user.generate_token_for(:password_reset)

    mail to: @user.email, subject: "Reset your password"
  end

  def email_verification
    @user = params[:user]
    @signed_id = @user.generate_token_for(:email_verification)

    mail to: @user.email, subject: "Verify your email"
  end

  def otp
    @user = params[:user]
    otp = @user.otp.generate_new_code!
    @formatted_otp = format(otp)

    mail(to: @user.email, subject: "Benefactorum : Voici votre code de connexion")
  end

  private

  def format(otp)
    otp.chars.each_with_index.map do |char, index|
      if index == 2
        "<span style='letter-spacing: 12px;'>#{char}</span>"
      elsif index < otp.length - 1
        "<span style='letter-spacing: 2px;'>#{char}</span>"
      else
        char
      end
    end.join
  end
end
