class ApplicationMailer < ActionMailer::Base
  prepend_view_path "app/views/mailers"
  default from: "contact@benefactorum.org"
  layout "mailer"
end
