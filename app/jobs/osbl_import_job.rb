class OsblImportJob < ApplicationJob
  queue_as :default

  SECRET_KEY = Rails.application.credentials.dig(:firecrawl, :secret_key)
  MAX_DURATION = 3.minutes
  DEFAULT_INTERVAL = 5.seconds

  def perform(osbl_import_id:, interval: DEFAULT_INTERVAL, max_duration: MAX_DURATION)
    osbl_import = OsblImport.find(osbl_import_id)

    response = get_extract_data(osbl_import.firecrawl_job_id)

    case response["status"]
    when "completed"
      process_extracted_data(osbl_import, response["data"])
    when "processing"
      if Time.current - osbl_import.created_at < MAX_DURATION
        OsblImportJob.set(wait: interval).perform_later(osbl_import_id:, interval: interval)
      else
        error_handling(osbl_import, "timed_out")
      end
    when "failed", "cancelled"
      error_handling(osbl_import, response["status"])
    else
      Rails.logger.error("OSBL import ID=#{osbl_import.id} unknown status: #{response["status"]}")
    end
  end

  private

  def get_extract_data(job_id)
    FirecrawlApi.new(SECRET_KEY).get_extract_status(job_id)
  end

  def process_extracted_data(osbl_import, extracted_data)
    osbl_import.update!(extracted_data:, status: "extracted")
    OsblCreationFromImportJob.perform_later(osbl_import.id)
  end

  def error_handling(osbl_import, firecrawl_status)
    osbl_import.update!(status: firecrawl_status)

    Rails.logger.error("OSBL import ID=#{osbl_import.id} error during extraction.")
  end
end
