import type { Staff } from '~/types/staff'

export type PenaltyConsequence = 'warn' | 'dismissal'

export interface Penalty {
  id: number
  staff_id: number
  staff_full_name: string
  shift_id: number
  shift_date: string
  reason: string
  amount: number
  consequence: PenaltyConsequence | null
  created_at: string
}
