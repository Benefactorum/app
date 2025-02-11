FactoryBot.define do
  factory :contribution do
    association :user
    status { :brouillon }
    contributable { build(:osbl_creation) }

    trait :with_body do
      body { "Body" }
    end

    # Contributable types
    trait :osbl_creation do
      contributable { build(:osbl_creation) }
    end

    trait :osbl_update do
      contributable { build(:osbl_update) }
    end

    trait :feedback do
      contributable { build(:feedback) }
      with_body
    end

    trait :feature_request do
      contributable { build(:feature_request) }
      with_body
    end

    trait :bug_report do
      contributable { build(:bug_report) }
      with_body
    end

    trait :correction_request do
      contributable { build(:correction_request) }
      with_body
    end

    trait :other do
      contributable { build(:other) }
      with_body
    end
  end

  # Contributables factories
  factory :osbl_creation, class: Contribution::OsblCreation do
    osbl_data do
      {
        name: "OSBL Created",
        tax_reduction: "intérêt_général",
        osbls_causes_attributes: [{cause_id: create(:cause).id}]
      }
    end
  end

  factory :osbl_update, class: Contribution::OsblUpdate do
    osbl_data do
      {
        name: "OSBL Updated",
        tax_reduction: "aide_aux_personnes_en_difficulté",
        osbls_causes_attributes: [{cause_id: create(:cause).id}]
      }
    end
  end

  factory :feedback, class: Contribution::Feedback
  factory :feature_request, class: Contribution::FeatureRequest
  factory :bug_report, class: Contribution::BugReport
  factory :correction_request, class: Contribution::CorrectionRequest
  factory :other, class: Contribution::Other
end
