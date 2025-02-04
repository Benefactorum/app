RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end

module FactoryBotFileUploadHelper
  def fixture_file_upload(path, mime_type)
    Rack::Test::UploadedFile.new(
      Rails.root.join(path),
      mime_type
    )
  end
end

FactoryBot::SyntaxRunner.include FactoryBotFileUploadHelper
