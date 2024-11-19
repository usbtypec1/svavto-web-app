export interface CarWashService {
  id: string
  name: string
  is_countable?: boolean
  children?: CarWashService[]
}
