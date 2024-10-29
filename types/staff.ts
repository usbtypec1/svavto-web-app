import type { MonthAndYear } from '~/types/schedules'


export interface Staff {
  id: number
  full_name: string
  car_sharing_phone_number: string
  console_phone_number: string
  is_banned: boolean
  created_at: string
  available_dates: MonthAndYear[]
}
