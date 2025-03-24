export type PenaltyConsequence = "warn" | "dismissal"

export interface CarTransporterPenalty {
  id: number
  staff_id: number
  staff_full_name: string
  date: string
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
  staffId: number
  reason: string
  amount: number
  photoUrls: string[]
}

export interface CarWashPenaltyCreateEvent {
  reason: string
  date: Date
  amount: number
}
