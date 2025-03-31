class OsblCreationFromImportJob
  class MapAssociationsService
    def self.call(items, model_class, create_missing: true)
      new(items, model_class, create_missing).call
    end

    def initialize(items, model_class, create_missing)
      @items = items
      @model_class = model_class
      @create_missing = create_missing
    end

    def call
      return nil if @items.blank?

      @items.map do |item|
        process_record(item)
      end.compact.uniq { |k| k[model_id_key] }
    end

    private

    def process_record(item)
      record = find_or_create_record(item["name"])
      return nil unless record

      {
        model_id_key => record.id.to_s,
        "name" => record.name
      }
    end

    def find_or_create_record(name)
      if @create_missing
        @model_class.find_or_create_by!(name: name)
      else
        record = @model_class.find_by(name: name)
        unless record
          Rails.logger.error("#{@model_class.name.demodulize} not found: #{name}")
          return nil
        end
        record
      end
    end

    def model_id_key
      "#{@model_class.name.demodulize.underscore}_id"
    end
  end
end
