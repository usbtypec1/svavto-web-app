import type { CarWashListItem } from "~/types/car-washes"
import type { Staff, StaffIdAndName } from "~/types/staff"

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
  car_wash_id: number | null
  car_wash_name: string | null
  staff_id: number
  staff_full_name: string
  started_at: string | null
  finished_at: string | null
  confirmed_at: string | null
  created_at: string
  type: "regular" | "extra" | "test"
}

export interface ShiftsConfirmation {
  date: string
  staff_list: StaffIdAndName[]
}

export interface CurrentShift {
  id: number
  date: string
  car_wash: CarWashListItem | null
  staff: Staff
  is_started: boolean
  is_finished: boolean
  is_windshield_washer_hidden: boolean
  created_at: string
}
