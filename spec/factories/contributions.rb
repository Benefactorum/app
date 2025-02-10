FactoryBot.define do
  factory :contribution do
    association :user
    status { "brouillon" }
    contributable { build(:osbl_creation) }

    trait :osbl_creation do
      contributable { build(:osbl_creation) }
    end

    trait :osbl_update do
      contributable { build(:osbl_update) }
    end

    trait :feedback do
      contributable { build(:feedback) }
    end

    trait :feature_request do
      contributable { build(:feature_request) }
    end

    trait :bug_report do
      contributable { build(:bug_report) }
    end

    trait :correction_request do
      contributable { build(:correction_request) }
    end

    trait :other do
      contributable { build(:other) }
    end
  end
  # contributables factories

  factory :osbl_creation, class: "OsblCreation" do
    osbl_data do
      {
        name: "OSBL Created",
        tax_reduction: "intérêt_général",
        osbls_causes_attributes: [{cause_id: 1}]
      }
    end
  end

  factory :osbl_update, class: "OsblUpdate" do
    osbl_data do
      {
        name: "OSBL Updated",
        tax_reduction: "aide_aux_personnes_en_difficulté",
        osbls_causes_attributes: [{cause_id: 1}]
      }
    end
  end

  factory :feedback, class: "Feedback" do
  end

  factory :feature_request, class: "FeatureRequest" do
  end

  factory :bug_report, class: "BugReport" do
  end

  factory :correction_request, class: "CorrectionRequest" do
  end

  factory :other, class: "Other" do
  end
end
