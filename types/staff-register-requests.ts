import { StaffType } from "./staff"

export interface StaffRegisterRequest {
  id: number
  staff_id: number
  full_name: string
  car_sharing_phone_number: string
  console_phone_number: string
  staff_type: StaffType
  created_at: string
}
