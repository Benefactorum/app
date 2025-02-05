export interface ContributionType {
  id: number
  user_id: string
  status: number
  contributable_id: string
  contributable_type: string
}

export interface FundRecord {
  type: string
  percent: number
  amount?: number
}

export interface AnnualFinance {
  year: number
  budget?: number
  treasury?: number
  employees_count?: number
  fund_sources_attributes?: FundRecord[]
  fund_allocations_attributes?: FundRecord[]
  certified?: boolean
}

export interface Document {
  type: string
  file: File
  name?: string
  year?: number
  description?: string
}

export interface Address {
  street_number?: string
  street_name: string
  additional_info?: string
  postal_code: string
  city: string
  latitude: number
  longitude: number
}

export interface Location {
  type: string
  address_attributes: Address
  name?: string
  description?: string
  website?: string
}

export interface OsblCreationData {
  contribution: {
    body?: string
    files?: File[]
    osbl: OsblData
  }
}

export interface OsblData {
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
  document_attachments_attributes?: Array<{ document_attributes: Document }>
  locations_attributes?: Location[]
}

export interface FormProps {
  data: OsblData
  setData: (key: keyof OsblData | string, value: OsblData[keyof OsblData] | any) => void
  errors: Partial<Record<keyof OsblData | string, string>>
  clearErrors: (...fields: Array<keyof OsblData | string>) => void
  setError: (field: string, error: any) => void
}
