<template>
  <div>
    <CarToWashAdditionalServicesForm
      :specific-car-wash-services="carWashServices"
      v-model:service-id-to-count="serviceIdToCount"
    />
    <MainButton
      :visible="isMainButtonVisible"
      text="Подтвердить"
      @click="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp } from "vue-tg"
import CarToWashAdditionalServicesForm from "~/components/cars-to-wash/forms/CarToWashAdditionalServicesForm.vue"
import type { CarWashService } from "~/types/car-wash-services"

const route = useRoute()
const carWashId = Number(route.params.id as string)

const allowedServiceParentIds = ["47c58bdf-bf49-4af7-9f1a-87ec2bd185b9"]

const serviceIdToCount = ref<Record<string, number>>({})

const isMainButtonVisible = computed((): boolean => {
  return Object.keys(serviceIdToCount.value).length > 0
})

const runtimeConfig = useRuntimeConfig()
const { data: carWashServices } = await useFetch("/car-washes/services/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: { car_wash_ids: carWashId },
  transform(data: { services: CarWashService[] }) {
    return data.services.filter(
      (service) =>
        service.parent && allowedServiceParentIds.includes(service.parent?.id),
    )
  },
})
const serviceIdToName = computed((): Record<string, string> => {
  if (!carWashServices.value) return {}
  return Object.fromEntries(
    carWashServices.value.map((service) => [service.id, service.name]),
  )
})

const serializedData = computed(() => {
  const services = Object.entries(serviceIdToCount.value).map(
    ([id, count]) => ({ id, name: serviceIdToName.value[id], count }),
  )
  return JSON.stringify(services)
})
const { sendData } = useWebApp()
const onSubmit = (): void => {
  sendData(serializedData.value)
}
</script>
