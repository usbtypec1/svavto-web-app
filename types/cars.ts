import type { AdditionalService } from "~/types/additional-services"
import type { CarWashIdAndName } from "~/types/car-washes"

export type ClassTypeValue = "comfort" | "business" | "van"
export type WashTypeValue = "planned" | "urgent"

export enum WindshieldWasherType {
  None = "none",
  Water = "water",
  Antifreeze = "antifreeze",
}

export interface WindshieldWasherTypeOption {
  label: string
  value: WindshieldWasherType
}

export interface CarToWash {
  number: string
  classType: ClassTypeValue
  washType: WashTypeValue
  windshieldWasherType: WindshieldWasherType
  windshieldWasherRefilledBottlePercentage: number
}

export interface CarToWashDraft extends Partial<CarToWash> {}

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
  car_wash: CarWashIdAndName
}

export interface TranferredCarsListItemAdditionalService {
  id: string
  name: string
  count: number
}

export interface TranferredCarsListItem {
  id: number
  number: string
  class_type: ClassTypeValue
  wash_type: WashTypeValue
  car_wash_id: number
  car_wash_name: string
  windshield_washer_refilled_bottle_percentage: number
  additional_services: TranferredCarsListItemAdditionalService[]
  created_at: string
}

export interface TransferredCarsListResponseData {
  staff_id: number
  staff_full_name: string
  shift_id: number
  shift_date: string
  transferred_cars: TranferredCarsListItem[]
}

export interface TransferredCarDetail {
  id: number
  staff_id: number
  staff_full_name: string
  shift_id: number
  shift_date: string
  number: string
  class_type: ClassTypeValue
  wash_type: WashTypeValue
  car_wash_id: number
  car_wash_name: string
  windshield_washer_refilled_bottle_percentage: number
  additional_services: TranferredCarsListItemAdditionalService[]
  created_at: string
}

export interface UpdatedAdditionalService {
  id: string
  count: number
}

export interface TransferredCarUpdateEvent {
  additionalServices: UpdatedAdditionalService[]
  carWashId: number
  classType: string
  number: string
  washType: string
  windshieldWasherType: string
  windshieldWasherRefilledBottlePercentage: number
}
