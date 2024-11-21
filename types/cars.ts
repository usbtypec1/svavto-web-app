import type { AdditionalService } from '~/types/additional-services'

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

export interface CarToWashDetail {
  id: number
  number: string
  wash_type: WashTypeValue
  class_type: ClassTypeValue
  windshield_washer_refilled_bottle_percentage: number
  created_at: string
  additional_services: AdditionalService[]
}
