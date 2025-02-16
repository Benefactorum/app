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
  file: File | { filename: string, url: string }
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

export interface FilesAsObject { [key: string]: { filename: string, url: string } }

export interface Contribution {
  contribution: {
    body?: string
    files?: File[] | FilesAsObject
    osbl: NewOsbl
  }
}

export type ContributionData = Contribution['contribution']

export interface NewOsbl {
  name: string
  website?: string
  logo?: File | { filename: string, url: string }
  description?: string
  osbls_causes_attributes: Array<{ cause_id: number, name: string }>
  tax_reduction: 'intérêt_général' | 'aide_aux_personnes_en_difficulté'
  osbls_keywords_attributes?: Array<{ keyword_id: number, name: string }>
  geographical_scale?: 'local' | 'regional' | 'national' | 'international'
  osbls_intervention_areas_attributes?: Array<{ intervention_area_id: number, name: string }>
  osbls_labels_attributes?: Array<{ label_id: number, name: string }>
  annual_finances_attributes?: AnnualFinance[]
  osbl_type?: 'association' | 'fonds_de_dotation' | 'fondation'
  public_utility?: boolean
  creation_year?: number
  contact_email?: string
  document_attachments_attributes?: Array<{ document_attributes: Document }>
  locations_attributes?: Location[]
}

export interface OsblUpdate {
  name: string
  website?: string
  logo?: File | { filename: string, url: string }
  description?: string
  osbls_causes_attributes: {
    [key: string]: {
      cause_id: number
      name: string
    }
  }
  tax_reduction: 'intérêt_général' | 'aide_aux_personnes_en_difficulté'
  osbls_keywords_attributes?: {
    [key: string]: {
      keyword_id: number
      name: string
    }
  }
  geographical_scale?: 'local' | 'regional' | 'national' | 'international'
  osbls_intervention_areas_attributes?: {
    [key: string]: {
      intervention_area_id: number
      name: string
    }
  }
  osbls_labels_attributes?: {
    [key: string]: {
      label_id: number
      name: string
    }
  }
  annual_finances_attributes?: {
    [key: string]: {
      year: number
      budget?: number
      treasury?: number
      employees_count?: number
      certified?: string
      fund_sources_attributes?: {
        [key: string]: FundRecord
      }
      fund_allocations_attributes?: {
        [key: string]: FundRecord
      }
    }
  }
  osbl_type?: 'association' | 'fonds_de_dotation' | 'fondation'
  public_utility?: string
  creation_year?: number
  contact_email?: string
  document_attachments_attributes?: {
    [key: string]: {
      document_attributes: Document
    }
  }
  locations_attributes?: {
    [key: string]: Location
  }
}

export interface FormProps {
  data: NewOsbl
  setData: (key: keyof NewOsbl | string, value: NewOsbl[keyof NewOsbl] | any) => void
  errors: Partial<Record<keyof NewOsbl | string, string>>
  clearErrors: (...fields: Array<keyof NewOsbl | string>) => void
  setError: (field: string, error: any) => void
}
