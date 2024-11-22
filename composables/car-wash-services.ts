import type { CarWashService } from '~/types/car-wash-services'
import { groupCarWashServicesByParent, mapCarWashServiceIdToName } from '~/utils/car-wash-services'

export const useTransformedCarWashServices = (carWashServices: Ref<CarWashService[] | null | undefined>) => {
  const groupedByParentId = computed(() => groupCarWashServicesByParent(carWashServices.value ?? []))
  const idToName = computed(() => {
    if (!carWashServices.value) return []
    const parents: CarWashService[] = carWashServices.value
      .filter(service => !!service.parent)
      .map(({ parent }) => parent!)
    return mapCarWashServiceIdToName([...carWashServices.value, ...parents])
  })
  const ids = computed((): string[] => carWashServices.value?.map((service) => service.id) ?? [])

  const idToPrice = computed(() => {
    if (!carWashServices.value) return []
    return Object.fromEntries(
      carWashServices.value
        .filter(({ price }) => !!price)
        .map(({ id, price }) => [id, price]),
    )
  })

  return {
    groupedByParentId,
    idToName,
    ids,
    idToPrice,
  }
}
