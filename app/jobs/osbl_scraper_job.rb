class OsblScraperJob < ApplicationJob
  queue_as :default

  SECRET_KEY = Rails.application.credentials.dig(:firecrawl, :secret_key)

  def perform(job_id, osbl_uri:, interval: 5.seconds)
    response = get_extract_data(job_id)

    case response["status"]
    when "completed"
      process_completed_data(response["data"])
    when "pending"
      # Schedule the job to run again after a delay
      if interval > 1.minute
        # advert Error Monitoring Service
        Rails.logger.error("OSBL scraping failed for osbl_uri: #{osbl_uri}, timeout")
      else
        OsblScraperJob.set(wait: interval).perform_later(job_id, osbl_uri: osbl_uri, interval: interval * 2)
      end
    else # "failed", "cancelled"
      # advert Error Monitoring Service
      Rails.logger.error("OSBL scraping failed for osbl_uri: #{osbl_uri} with status: #{response["status"]}")
    end
  end

  private

  def get_extract_data(job_id)
    Firecrawl.new(SECRET_KEY).get_extract_status(job_id)
  end

  def process_completed_data(data)
    # TODO: Implement processing of completed data
    # The processing logic should be moved to a separate service
  end
end
