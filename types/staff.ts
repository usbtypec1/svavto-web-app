export interface Staff {
  id: number
  full_name: string
  car_sharing_phone_number: string
  console_phone_number: string
  banned_at: string | null
  created_at: string
}

export interface StaffIdAndName {
  id: number
  full_name: string
}
