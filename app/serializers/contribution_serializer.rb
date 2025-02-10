class ContributionSerializer
  def initialize(contribution)
    @contribution = contribution
  end

  def as_json(*)
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
    when "OsblCreation"
      "Ajouter #{contributable.osbl_data["name"]}"
    when "OsblUpdate"
      "Modifier #{contributable.osbl_data["name"]}"
    when "Feedback"
      "Retour d'expérience"
    when "FeatureRequest"
      "Suggestion"
    when "BugReport"
      "Rapport de bogue"
    when "CorrectionRequest"
      "Correctif"
    when "Other"
      "Autre"
    else
      ""
    end
  end
end
