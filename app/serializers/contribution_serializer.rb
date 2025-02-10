class ContributionSerializer
  def initialize(contribution)
    @contribution = contribution
  end

  def as_json
    {
      id: @contribution.id,
      created_at: @contribution.created_at,
      status: @contribution.status,
      github_resource_url: @contribution.github_resource_url,
      type_label: compute_type_label
    }
  end

  private

  def compute_type_label
    contributable = @contribution.contributable
    case @contribution.contributable_type
    when "Contribution::OsblCreation"
      "Ajouter #{contributable.osbl_data["name"]}"
    when "Contribution::OsblUpdate"
      "Modifier #{contributable.osbl_data["name"]}"
    when "Contribution::Feedback"
      "Retour d'expérience"
    when "Contribution::FeatureRequest"
      "Suggestion"
    when "Contribution::BugReport"
      "Rapport de bogue"
    when "Contribution::CorrectionRequest"
      "Correctif"
    when "Contribution::Other"
      "Autre"
    else
      raise "Unknown contributable type: #{@contribution.contributable_type}"
    end
  end
end
