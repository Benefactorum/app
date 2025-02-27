# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_02_26_181406) do
  create_table "accounts", force: :cascade do |t|
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.string "street_number"
    t.string "street_name", null: false
    t.string "additional_info"
    t.string "postal_code", null: false
    t.string "city", null: false
    t.string "country", default: "France", null: false
    t.decimal "latitude", precision: 10, scale: 6, null: false
    t.decimal "longitude", precision: 10, scale: 6, null: false
    t.string "addressable_type", null: false
    t.integer "addressable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["addressable_type", "addressable_id"], name: "index_addresses_on_addressable_type_and_addressable_id", unique: true
    t.index ["latitude", "longitude"], name: "index_addresses_on_latitude_and_longitude", where: "addressable_type = 'Osbl::Location'"
    t.check_constraint "latitude >= -90 AND latitude <= 90", name: "check_latitude_range"
    t.check_constraint "longitude >= -180 AND longitude <= 180", name: "check_longitude_range"
  end

  create_table "contribution_bug_reports", force: :cascade do |t|
  end

  create_table "contribution_correction_requests", force: :cascade do |t|
  end

  create_table "contribution_feature_requests", force: :cascade do |t|
  end

  create_table "contribution_feedbacks", force: :cascade do |t|
  end

  create_table "contribution_osbl_creations", force: :cascade do |t|
    t.json "osbl_data", null: false
  end

  create_table "contribution_osbl_updates", force: :cascade do |t|
    t.json "osbl_data", null: false
  end

  create_table "contribution_others", force: :cascade do |t|
  end

  create_table "contributions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "contributable_type", null: false
    t.integer "contributable_id", null: false
    t.string "github_resource_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "status", default: 0
    t.text "body"
    t.index ["contributable_type", "contributable_id"], name: "index_contributions_on_contributable"
    t.index ["user_id"], name: "index_contributions_on_user_id"
    t.check_constraint "NOT (contributable_type IN ('Contribution::Feedback', 'Contribution::FeatureRequest', 'Contribution::BugReport', 'Contribution::CorrectionRequest', 'Contribution::Other')) OR (body IS NOT NULL AND body <> '')", name: "body_required_for_specific_types"
  end

  create_table "document_attachments", force: :cascade do |t|
    t.integer "document_id", null: false
    t.string "attachable_type", null: false
    t.integer "attachable_id", null: false
    t.index ["attachable_type", "attachable_id"], name: "index_document_attachments_on_attachable"
    t.index ["document_id", "attachable_type", "attachable_id"], name: "index_document_attachments_uniqueness", unique: true
    t.index ["document_id"], name: "index_document_attachments_on_document_id"
  end

  create_table "documents", force: :cascade do |t|
    t.integer "type", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.integer "year"
    t.check_constraint "type NOT IN (1, 2) OR (type IN (1, 2) AND year IS NOT NULL)", name: "year_required_for_specific_types"
    t.check_constraint "type NOT IN (3, 4) OR (type IN (3, 4) AND name IS NOT NULL)", name: "name_required_for_specific_types"
    t.check_constraint "year >= 1000", name: "year_as_4_digits"
  end

  create_table "osbl_annual_finances", force: :cascade do |t|
    t.integer "year", null: false
    t.decimal "treasury", precision: 15, scale: 2
    t.decimal "budget", precision: 15, scale: 2
    t.boolean "certified"
    t.integer "employees_count"
    t.integer "osbl_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["osbl_id"], name: "index_osbl_annual_finances_on_osbl_id"
    t.check_constraint "budget >= 0", name: "budget_positive"
    t.check_constraint "employees_count >= 0", name: "employees_count_positive"
    t.check_constraint "year >= 1000", name: "year_as_4_digits"
  end

  create_table "osbl_causes", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_osbl_causes_on_name", unique: true
  end

  create_table "osbl_fund_allocations", force: :cascade do |t|
    t.integer "type", null: false
    t.decimal "percent", precision: 5, scale: 2, null: false
    t.decimal "amount", precision: 15, scale: 2
    t.integer "annual_finance_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["annual_finance_id", "type"], name: "index_osbl_fund_allocations_on_annual_finance_id_and_type", unique: true
    t.index ["annual_finance_id"], name: "index_osbl_fund_allocations_on_annual_finance_id"
    t.check_constraint "amount > 0", name: "amount_positive"
    t.check_constraint "percent > 0 AND percent <= 100", name: "percent_within_range"
  end

  create_table "osbl_fund_sources", force: :cascade do |t|
    t.integer "type", null: false
    t.decimal "percent", precision: 5, scale: 2, null: false
    t.decimal "amount", precision: 15, scale: 2
    t.integer "annual_finance_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["annual_finance_id", "type"], name: "index_osbl_fund_sources_on_annual_finance_id_and_type", unique: true
    t.index ["annual_finance_id"], name: "index_osbl_fund_sources_on_annual_finance_id"
    t.check_constraint "amount > 0", name: "amount_positive"
    t.check_constraint "percent > 0 AND percent <= 100", name: "percent_within_range"
  end

  create_table "osbl_intervention_areas", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_osbl_intervention_areas_on_name", unique: true
    t.check_constraint "length(name) >= 3 AND length(name) <= 100", name: "intervention_areas_name_length_check"
  end

  create_table "osbl_keywords", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_osbl_keywords_on_name", unique: true
    t.check_constraint "length(name) >= 3 AND length(name) <= 100", name: "keywords_name_length_check"
  end

  create_table "osbl_labels", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "website"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_osbl_labels_on_name", unique: true
  end

  create_table "osbl_locations", force: :cascade do |t|
    t.integer "type", null: false
    t.string "name"
    t.text "description"
    t.string "website"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "osbl_id", null: false
    t.index ["osbl_id"], name: "index_locations_on_osbl_id_siege_social", unique: true, where: "type = 0"
    t.index ["osbl_id"], name: "index_osbl_locations_on_osbl_id"
    t.check_constraint "type NOT IN (1, 2, 3) OR (type IN (1, 2, 3) AND name IS NOT NULL)", name: "name_required_for_specific_types"
  end

  create_table "osbls", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "website"
    t.text "description"
    t.integer "tax_reduction", null: false
    t.integer "geographical_scale"
    t.integer "osbl_type"
    t.integer "creation_year"
    t.boolean "public_utility", default: false, null: false
    t.index ["name"], name: "index_osbls_on_name", unique: true
    t.index ["website"], name: "index_osbls_on_website", unique: true
    t.check_constraint "creation_year >= 1000", name: "creation_year_as_4_digits"
  end

  create_table "osbls_causes", force: :cascade do |t|
    t.integer "osbl_id", null: false
    t.integer "cause_id", null: false
    t.index ["cause_id", "osbl_id"], name: "index_osbls_causes_on_cause_id_and_osbl_id", unique: true
    t.index ["osbl_id", "cause_id"], name: "index_osbls_causes_on_osbl_id_and_cause_id", unique: true
  end

  create_table "osbls_intervention_areas", force: :cascade do |t|
    t.integer "osbl_id", null: false
    t.integer "intervention_area_id", null: false
    t.index ["intervention_area_id", "osbl_id"], name: "idx_on_intervention_area_id_osbl_id_cc1fbf5e72", unique: true
    t.index ["osbl_id", "intervention_area_id"], name: "idx_on_osbl_id_intervention_area_id_0e27c7488c", unique: true
  end

  create_table "osbls_keywords", force: :cascade do |t|
    t.integer "osbl_id", null: false
    t.integer "keyword_id", null: false
    t.index ["keyword_id", "osbl_id"], name: "index_osbls_keywords_on_keyword_id_and_osbl_id", unique: true
    t.index ["osbl_id", "keyword_id"], name: "index_osbls_keywords_on_osbl_id_and_keyword_id", unique: true
  end

  create_table "osbls_labels", force: :cascade do |t|
    t.integer "osbl_id", null: false
    t.integer "label_id", null: false
    t.index ["label_id", "osbl_id"], name: "index_osbls_labels_on_label_id_and_osbl_id", unique: true
    t.index ["osbl_id", "label_id"], name: "index_osbls_labels_on_osbl_id_and_label_id", unique: true
  end

  create_table "user_otps", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "secret", null: false
    t.integer "counter", default: 0
    t.boolean "used", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_otps_on_user_id"
  end

  create_table "user_sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "user_agent"
    t.string "ip_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest"
    t.boolean "verified", default: false, null: false
    t.integer "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.datetime "terms_and_privacy_accepted_at", null: false
    t.index ["account_id"], name: "index_users_on_account_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.check_constraint "email LIKE '%_@_%._%'", name: "email_format_check"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "contributions", "users"
  add_foreign_key "document_attachments", "documents", on_delete: :cascade
  add_foreign_key "osbl_annual_finances", "osbls", on_delete: :cascade
  add_foreign_key "osbl_fund_allocations", "osbl_annual_finances", column: "annual_finance_id", on_delete: :cascade
  add_foreign_key "osbl_fund_sources", "osbl_annual_finances", column: "annual_finance_id", on_delete: :cascade
  add_foreign_key "osbl_locations", "osbls", on_delete: :cascade
  add_foreign_key "osbls_causes", "osbl_causes", column: "cause_id", on_delete: :cascade
  add_foreign_key "osbls_causes", "osbls", on_delete: :cascade
  add_foreign_key "osbls_intervention_areas", "osbl_intervention_areas", column: "intervention_area_id", on_delete: :cascade
  add_foreign_key "osbls_intervention_areas", "osbls", on_delete: :cascade
  add_foreign_key "osbls_keywords", "osbl_keywords", column: "keyword_id", on_delete: :cascade
  add_foreign_key "osbls_keywords", "osbls", on_delete: :cascade
  add_foreign_key "osbls_labels", "osbl_labels", column: "label_id", on_delete: :cascade
  add_foreign_key "osbls_labels", "osbls", on_delete: :cascade
  add_foreign_key "user_otps", "users", on_delete: :cascade
  add_foreign_key "user_sessions", "users", on_delete: :cascade
  add_foreign_key "users", "accounts"
end
