export interface CurrentUserType {
  id: number
  first_name: string
}

export type ProfilePictureUrlType = string | null

export interface SelectOption {
  readonly label: string
  readonly value: number
}
