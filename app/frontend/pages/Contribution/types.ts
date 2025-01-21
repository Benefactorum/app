export interface ContributionType {
  id: number
  user_id: string
  status: number
  contributable_id: string
  contributable_type: string
}

export type ContributionFormType = Omit<ContributionType, 'id'>

export interface OsblType {
  id: number
  name: string
}

export type OsblFormType = Omit<OsblType, 'id'>

export interface AnnualFinance {
  year: number
  budget?: number
  treasury?: number
  employees_count?: number
}

export interface FormData {
  name: string
  website?: string
  logo?: File
  description?: string
  osbls_causes_attributes: Array<{ cause_id: string }>
  tax_reduction: string
  osbls_keywords_attributes?: Array<{ keyword_id: string }>
  geographical_scale?: string
  osbls_intervention_areas_attributes?: Array<{ intervention_area_id: string }>
  annual_finances_attributes?: AnnualFinance[]
  osbl_type?: string
  creation_year?: number
  contact_email?: string
}

export interface FormProps {
  data: FormData
  setData: (key: keyof FormData, value: FormData[keyof FormData]) => void
  errors: Partial<Record<keyof FormData, string>>
  clearErrors: (key: keyof FormData) => void
}
