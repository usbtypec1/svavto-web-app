export type PenaltyConsequence = "warn" | "dismissal"

export interface Penalty {
  id: number
  staff_id: number
  staff_full_name: string
  shift_id: number
  shift_date: string
  reason: string
  amount: number
  consequence: PenaltyConsequence | null
  photo_urls: string[]
  created_at: string
}

export interface CarWashPenalty {
  id: number
  car_wash_id: number
  reason: string
  amount: number
  date: string
  created_at: string
}

export interface CarTransporterPenaltyCreateEvent {
  shiftId: number
  reason: string
  amount: number
  photoUrls: string[]
}

export interface CarWashPenaltyCreateEvent {
  reason: string
  date: Date
  amount: number
}
