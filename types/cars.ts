export type ClassTypeValue = 'comfort' | 'business' | 'van'
export type WashTypeValue = 'planned' | 'urgent'

export interface CarToWash {
  number: string
  classType: ClassTypeValue
  washType: WashTypeValue
  windshieldWasherRefilledBottlePercentage: number
}

export interface CarToWashDraft extends Partial<CarToWash> {
}

export interface ClassType {
  label: string
  value: ClassTypeValue
}

export interface WashType {
  label: string
  value: WashTypeValue
}