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

export interface FundRecord {
  type?: string
  percent?: number
  amount?: number
}

export interface AnnualFinance {
  year?: number
  budget?: number
  treasury?: number
  employees_count?: number
  fund_sources_attributes?: FundRecord[]
  fund_allocations_attributes?: FundRecord[]
  certified?: boolean
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
  public_utility?: boolean
  creation_year?: number
  contact_email?: string
}

export interface FormProps {
  data: FormData
  setData: (key: keyof FormData | string, value: FormData[keyof FormData] | any) => void
  errors: Record<keyof FormData | string, string>
  clearErrors: (...fields: Array<keyof FormData | any>) => void
}
