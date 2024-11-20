import type { CarWashService } from '~/types/car-wash-services'

export const groupCarWashServicesByParent = (services: CarWashService[]): Record<string, CarWashService[]> => {
  const grouped: Record<string, CarWashService[]> = {}
  services.forEach(service => {
    const key = service.parent?.id || 'undefined'
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(service)
  })
  return grouped
}

export const mapCarWashServiceIdToName = (services: CarWashService[]): Record<string, string> => {
  return Object.fromEntries(
    services.map(({ id, name }) => [id, name]),
  )
}