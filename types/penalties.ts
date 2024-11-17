import type { Staff } from '~/types/staff'

export interface Penalty {
  id: number
  staff: Staff
  reason: string
  amount: number
  consequence: 'warn' | 'dismissal' | null
  created_at: string
}
