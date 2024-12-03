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
