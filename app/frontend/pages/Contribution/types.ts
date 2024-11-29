export interface ContributionType {
  id: number
  user_id: string
  status: number
  contributable_id: string
  contributable_type: string
}

export type ContributionFormType = Omit<ContributionType, 'id'>
