import type { CarWashListItem } from '~/types/car-washes'
import type { Staff } from '~/types/staff'

export interface Shift {
  id: number
  date: string
  started_at: string | null
  finished_at: string | null
  created_at: string
  car_wash: CarWashListItem | null
}

export interface ShiftListItem {
  id: number
  date: string
  car_wash: CarWashListItem | null
  staff: Staff
  is_started: boolean
  is_finished: boolean
  created_at: string
}

export interface ShiftsConfirmation {
  date: string
  staff_ids: number[]
}

export interface CurrentShift {
  id: number
  date: string
  car_wash: CarWashListItem | null
  staff: Staff
  is_started: boolean
  is_finished: boolean
  created_at: string
}
