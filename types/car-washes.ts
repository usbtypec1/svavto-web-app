import type { CarWashService } from '~/types/car-wash-services'

export interface CarWashIdAndName {
  id: number
  name: string
}

export interface CarWashListItem {
  id: number
  name: string
  comfort_class_car_transfer_price: number
  business_class_car_transfer_price: number
  van_transfer_price: number
  car_transporter_extra_shift_price: number
  urgent_car_wash_price: number
  item_dry_cleaning_price: number
  created_at: string
  updated_at: string
}

export interface CarWashWithServices {
  id: number
  name: string
  comfort_class_car_washing_price: number
  business_class_car_washing_price: number
  van_washing_price: number
  windshield_washer_price_per_bottle: number
  car_transporter_extra_shift_price: number
  urgent_car_wash_price: number
  item_dry_cleaning_price: number
  created_at: string
  updated_at: string
  services: CarWashService[]
}

export interface CarWashFormValues {
  name: string
  comfort_class_car_transfer_price: number
  business_class_car_transfer_price: number
  van_transfer_price: number
  windshield_washer_price_per_bottle: number
}
