import type { Staff } from "~/types/staff"

export interface ShiftStatistics {
  shift_date: string
  penalty_amount: number
  surcharge_amount: number
  planned_comfort_cars_washed_count: number
  planned_business_cars_washed_count: number
  planned_vans_washed_count: number
  urgent_cars_washed_count: number
  is_extra_shift: boolean
  washed_cars_total_cost: number
  dry_cleaning_items_count: number
}

export interface TotalShiftStatistics {
  penalty_amount: number
  surcharge_amount: number
  planned_comfort_cars_washed_count: number
  planned_business_cars_washed_count: number
  planned_vans_washed_count: number
  urgent_cars_washed_count: number
  extra_shifts_count: number
  washed_cars_total_cost: number
  dry_cleaning_items_count: number
}

export interface StaffShiftsStatistics {
  staff: Staff
  shifts_statistics: ShiftStatistics[]
}
