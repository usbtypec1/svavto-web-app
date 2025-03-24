export interface CarTransporterSurcharge {
  id: number
  staff_id: number
  staff_full_name: string
  date: string
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
  staffId: number
  date: Date
  reason: string
  amount: number
}
