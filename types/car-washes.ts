export interface CarWashIdAndName {
  id: number
  name: string
}

export interface CarWashServiceParent {
  id: string
  name: string
}

export interface CarWashService {
  id: string
  name: string
  is_countable: boolean
  price: number
  parent: CarWashServiceParent | null
  max_count: number
  is_dry_cleaning: boolean
}

export interface CarWash {
  id: number
  name: string
  car_transporter_comfort_class_car_transfer_price: number
  car_transporter_business_class_car_transfer_price: number
  car_transporter_van_transfer_price: number
  car_transporter_and_washer_comfort_class_car_transfer_price: number
  car_transporter_and_washer_business_class_car_transfer_price: number
  car_transporter_and_washer_van_transfer_price: number
  windshield_washer_price_per_bottle: number
  is_hidden: boolean
  created_at: string
  updated_at: string
}

export interface CarWashWithServices {
  id: number
  name: string
  car_transporter_comfort_class_car_transfer_price: number
  car_transporter_business_class_car_transfer_price: number
  car_transporter_van_transfer_price: number
  car_transporter_and_washer_comfort_class_car_transfer_price: number
  car_transporter_and_washer_business_class_car_transfer_price: number
  car_transporter_and_washer_van_transfer_price: number
  windshield_washer_price_per_bottle: number
  is_hidden: boolean
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
