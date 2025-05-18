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
  car_transporters_comfort_class_car_washing_price: number
  car_transporters_business_class_car_washing_price: number
  car_transporters_van_washing_price: number
  car_transporters_and_washers_comfort_class_price: number
  car_transporters_and_washers_business_class_price: number
  car_transporters_and_washers_van_price: number
  windshield_washer_price_per_bottle: number
  is_hidden: boolean
  created_at: string
  updated_at: string
}

export interface CarWashWithServices {
  id: number
  name: string
  car_transporters_comfort_class_car_washing_price: number
  car_transporters_business_class_car_washing_price: number
  car_transporters_van_washing_price: number
  car_transporters_and_washers_comfort_class_price: number
  car_transporters_and_washers_business_class_price: number
  car_transporters_and_washers_van_price: number
  windshield_washer_price_per_bottle: number
  is_hidden: boolean
  created_at: string
  updated_at: string
  services: CarWashService[]
}

export interface CarWashFormValues {
  name: string
  car_transporters_comfort_class_car_washing_price: number
  car_transporters_business_class_car_washing_price: number
  car_transporters_van_washing_price: number
  car_transporters_and_washers_comfort_class_price: number
  car_transporters_and_washers_business_class_price: number
  car_transporters_and_washers_van_price: number
  windshield_washer_price_per_bottle: number
}
