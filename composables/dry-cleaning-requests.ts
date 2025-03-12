import type { DryCleaningRequest } from "~/types/dry-cleaning-requests"

export const useDryCleaningRequestReview = (
  dryCleaningRequest: Ref<DryCleaningRequest | null>,
) => {
  const serviceIdToCount = ref<Record<string, number>>({})

  const services = computed((): { id: string, count: number }[] => {
    return Object.entries(serviceIdToCount.value).map(([id, count]) => ({
      id,
      count,
    }))
  })

  const canBeApproved = computed((): boolean => {
    return Object.keys(serviceIdToCount.value).length > 0
  })

  const resetServiceIdToCount = (): void => {
    if (!dryCleaningRequest.value) return
    serviceIdToCount.value = Object.fromEntries(
      dryCleaningRequest.value.services.map((service) => [
        service.id,
        service.count,
      ]),
    )
  }
  const clearServiceIdToCount = (): void => {
    serviceIdToCount.value = {}
  }

  watchEffect(resetServiceIdToCount)

  return {
    canBeApproved,
    serviceIdToCount,
    resetServiceIdToCount,
    clearServiceIdToCount,
    services,
  }
}
