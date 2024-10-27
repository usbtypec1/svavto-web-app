export interface AdditionalServiceItem {
  name: string
  label: string
  isIncluded: boolean
  isCountEditable: boolean
  count: number
}

export interface AdditionalServiceParent {
  name: string
  label: string
  isIncluded: boolean,
  children: AdditionalServiceItem[]
}
