export const DocumentTypeList = [
  { value: 'statuts', label: 'Statuts' },
  { value: 'rapport_activite', label: "Rapport d'activité" },
  { value: 'rapport_financier', label: 'Rapport financier' },
  { value: 'proces_verbal', label: 'Procès verbal' },
  { value: 'autre', label: 'Autre' }
] as const

export const FundSourceTypeList = [
  { value: 'dons', label: 'Dons', group: 'main' },
  { value: 'aides_publiques', label: 'Aides publiques', group: 'main' },
  { value: 'revenus_d_activites', label: 'Revenus d\'activités', group: 'main' },
  { value: 'autre', label: 'Autre', group: 'main' }
] as const

export const FundAllocationTypeList = [
  { value: 'missions_sociales', label: 'Missions sociales', group: 'main' },
  { value: 'frais_de_fonctionnement', label: 'Frais de fonctionnement', group: 'main' },
  { value: 'frais_de_recherche_de_fonds', label: 'Frais de recherche de fonds', group: 'main' },
  { value: 'autre', label: 'Autre', group: 'main' }
] as const
