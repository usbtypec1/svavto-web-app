export interface CarWashService {
  id: string
  name: string
  is_countable?: boolean
  parent: CarWashService | null
}
