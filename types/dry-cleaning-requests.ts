export interface DryCleaningRequestService {
  id: string
  name: string
  count: number
  is_countable: boolean
}

export enum DryCleaningRequestStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
}

export interface DryCleaningRequest {
  id: number
  shift_id: number
  car_number: string
  photo_file_ids: string[]
  services: DryCleaningRequestService[]
  response_comment: string | null
  status: DryCleaningRequestStatus
  created_at: string
  updated_at: string
}
