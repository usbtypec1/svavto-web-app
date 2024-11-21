import type { CarWashService } from '~/types/car-wash-services'
import type { ClassType, WashType } from '~/types/cars'

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

export const classTypeOptions: ClassType[] = [
  {
    label: 'Комфорт',
    value: 'comfort',
  },
  {
    label: 'Бизнес',
    value: 'business',
  },
  {
    label: 'Фургон',
    value: 'van',
  },
]

export const washTypeOptions: WashType[] = [
  {
    label: 'Плановая',
    value: 'planned',
  },
  {
    label: 'Срочная',
    value: 'urgent',
  },
]

export const classTypeValueToLabel = Object.fromEntries(
  classTypeOptions.map(({ label, value }) => [value, label]),
)

export const washTypeValueToLabel = Object.fromEntries(
  washTypeOptions.map(({ label, value }) => [value, label]),
)