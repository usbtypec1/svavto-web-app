export interface CarWashService {
  id: string
  name: string
  is_countable?: boolean
  price?: number
  parent: CarWashService | null
}
