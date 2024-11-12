import type { CarWash } from '~/types/car-washes'
import type { Staff } from '~/types/staff'

export interface Shift {
  id: number
  date: string
  confirmed_at: string | null
  started_at: string | null
  finished_at: string | null
  created_at: string
  car_wash: CarWash
}

export interface ShiftWithStaff {
  id: number
  date: string
  confirmed_at: string | null
  started_at: string | null
  finished_at: string | null
  created_at: string
  staff: Staff
}
