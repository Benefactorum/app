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

ActiveRecord::Schema[8.0].define(version: 2025_01_22_064136) do
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

  create_table "annual_finances", force: :cascade do |t|
    t.integer "year", null: false
    t.decimal "treasury", precision: 15, scale: 2
    t.decimal "budget", precision: 15, scale: 2
    t.boolean "certified"
    t.integer "employees_count"
    t.integer "osbl_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["osbl_id"], name: "index_annual_finances_on_osbl_id"
    t.check_constraint "budget >= 0", name: "budget_positive"
    t.check_constraint "employees_count >= 0", name: "employees_count_positive"
    t.check_constraint "year >= 1000", name: "year_as_4_digits"
  end

  create_table "causes", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_causes_on_name", unique: true
  end

  create_table "contributions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "contributable_type", null: false
    t.integer "contributable_id", null: false
    t.string "github_resource_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contributable_type", "contributable_id"], name: "index_contributions_on_contributable"
    t.index ["user_id"], name: "index_contributions_on_user_id"
  end

  create_table "documents", force: :cascade do |t|
    t.integer "contribution_id"
    t.integer "osbl_id"
    t.integer "type", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contribution_id"], name: "index_documents_on_contribution_id"
    t.index ["osbl_id"], name: "index_documents_on_osbl_id"
  end

  create_table "fund_sources", force: :cascade do |t|
    t.integer "type", null: false
    t.decimal "percent", precision: 5, scale: 2, null: false
    t.decimal "amount", precision: 15, scale: 2
    t.integer "annual_finance_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["annual_finance_id", "type"], name: "index_fund_sources_on_annual_finance_id_and_type", unique: true
    t.index ["annual_finance_id"], name: "index_fund_sources_on_annual_finance_id"
    t.check_constraint "amount > 0", name: "amount_positive"
    t.check_constraint "percent > 0 AND percent <= 100", name: "percent_within_range"
  end

  create_table "intervention_areas", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_intervention_areas_on_name", unique: true
  end

  create_table "keywords", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_keywords_on_name", unique: true
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
    t.string "contact_email"
    t.boolean "public_utility", default: false, null: false
    t.index ["name"], name: "index_osbls_on_name", unique: true
    t.index ["website"], name: "index_osbls_on_website", unique: true
    t.check_constraint "contact_email IS NULL OR (contact_email IS NOT NULL AND contact_email LIKE '%_@_%._%')", name: "contact_email_format_check"
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

  create_table "otps", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "secret", null: false
    t.integer "counter", default: 0
    t.boolean "used", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_otps_on_user_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "user_agent"
    t.string "ip_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
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
  add_foreign_key "annual_finances", "osbls"
  add_foreign_key "contributions", "users"
  add_foreign_key "documents", "contributions"
  add_foreign_key "documents", "osbls"
  add_foreign_key "fund_sources", "annual_finances"
  add_foreign_key "osbls_causes", "causes", on_delete: :cascade
  add_foreign_key "osbls_causes", "osbls", on_delete: :cascade
  add_foreign_key "osbls_intervention_areas", "intervention_areas", on_delete: :cascade
  add_foreign_key "osbls_intervention_areas", "osbls", on_delete: :cascade
  add_foreign_key "osbls_keywords", "keywords", on_delete: :cascade
  add_foreign_key "osbls_keywords", "osbls", on_delete: :cascade
  add_foreign_key "otps", "users"
  add_foreign_key "sessions", "users"
  add_foreign_key "users", "accounts"
end
