import type { CarWashService } from '~/types/car-wash-services'
import { groupCarWashServicesByParent, mapCarWashServiceIdToName } from '~/utils/car-wash-services'

export const useTransformedCarWashServices = (carWashServices: Ref<CarWashService[] | null | undefined>) => {
  const groupedByParentId = computed(() => groupCarWashServicesByParent(carWashServices.value ?? []))
  const idToName = computed(() => mapCarWashServiceIdToName(carWashServices.value ?? []))
  const ids = computed((): string[] => carWashServices.value?.map((service) => service.id) ?? [])

  return {
    groupedByParentId,
    idToName,
    ids,
  }
}
