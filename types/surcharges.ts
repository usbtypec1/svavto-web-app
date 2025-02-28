export interface Surcharge {
  id: number
  staff_id: number
  staff_full_name: string
  shift_id: number
  shift_date: string
  reason: string
  amount: number
  created_at: string
}

export interface CarWashSurcharge {
  id: number
  car_wash_id: number
  reason: string
  amount: number
  date: string
  created_at: string
}

export interface CarWashSurchargeCreateEvent {
  reason: string
  amount: number
  date: Date
}

export interface CarTransporterSurchargeCreateEvent {
  shiftId: number
  reason: string
  amount: number
}
