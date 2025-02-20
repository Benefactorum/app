export interface FileAsObject { filename: string, url: string }
export interface FilesAsObject { [key: string]: FileAsObject }

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
  file: File | FileAsObject
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
  logo?: File | FileAsObject
  description?: string
  osbls_causes_attributes: Array<{ cause_id: string, name: string }>
  tax_reduction: 'intérêt_général' | 'aide_aux_personnes_en_difficulté'
  osbls_keywords_attributes?: Array<{ keyword_id: string, name: string }>
  geographical_scale?: 'local' | 'regional' | 'national' | 'international'
  osbls_intervention_areas_attributes?: Array<{ intervention_area_id: string, name: string }>
  osbls_labels_attributes?: Array<{ label_id: string, name: string, logo_url?: string }>
  annual_finances_attributes?: AnnualFinance[]
  osbl_type?: 'association' | 'fonds_de_dotation' | 'fondation'
  public_utility?: boolean
  creation_year?: number
  document_attachments_attributes?: Array<{ document_attributes: Document }>
  locations_attributes?: Location[]
}

export interface OsblUpdate {
  name: string
  website?: string
  logo?: File | FileAsObject
  description?: string
  tax_reduction: 'intérêt_général' | 'aide_aux_personnes_en_difficulté'
  geographical_scale?: 'local' | 'regional' | 'national' | 'international'
  osbl_type?: 'association' | 'fonds_de_dotation' | 'fondation'
  public_utility?: boolean
  creation_year?: string
  osbls_causes_attributes: {
    [key: number]: {
      cause_id: string
      name: string
    }
  }
  osbls_keywords_attributes?: {
    [key: number]: {
      keyword_id: string
      name: string
    }
  }
  osbls_intervention_areas_attributes?: {
    [key: number]: {
      intervention_area_id: string
      name: string
    }
  }
  osbls_labels_attributes?: {
    [key: number]: {
      label_id: string
      name: string
    }
  }
  annual_finances_attributes?: {
    [key: number]: {
      year: string
      certified?: boolean
      budget?: string
      treasury?: string
      employees_count?: string
      fund_sources_attributes?: {
        [key: number]: {
          type: string
          percent: string
          amount?: string
        }
      }
      fund_allocations_attributes?: {
        [key: number]: {
          type: string
          percent: string
          amount?: string
        }
      }
    }
  }
  document_attachments_attributes?: {
    [key: number]: {
      document_attributes: {
        type: string
        file: File | FileAsObject
        name?: string
        year?: string
        description?: string
      }
    }
  }
  locations_attributes?: {
    [key: number]: {
      type: string
      address_attributes: {
        street_number?: string
        street_name: string
        additional_info?: string
        postal_code: string
        city: string
        latitude: string
        longitude: string
      }
      name?: string
      description?: string
      website?: string
    }
  }
}

export interface FormProps {
  data: NewOsbl
  setData: (key: keyof NewOsbl | string, value: NewOsbl[keyof NewOsbl] | any) => void
  errors: Partial<Record<keyof NewOsbl | string, string>>
  clearErrors: (...fields: Array<keyof NewOsbl | string>) => void
  setError: (field: string, error: any) => void
}
