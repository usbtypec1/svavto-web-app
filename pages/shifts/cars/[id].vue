<template>
  <div>
    <Title>Редактировать доп.услуги</Title>
    <p class="text-xl font-semibold mb-2">Редактировать доп.услуги</p>
    <ProgressSpinner v-if="carToWashStatus === 'pending'"/>
    <CarToWashDetailCard
      v-else-if="carToWashStatus === 'success'"
      :car-to-wash="carToWash"
    />
    <CarToWashAdditionalServicesForm
      v-model:service-id-to-count="serviceIdToCount"
      :car-wash-services="carWashServices"
      class="my-6"
    />
    <MainButton
      text="Подтвердить"
      @click="onSubmitCarToWashWithAdditionalServices"
    />
  </div>
</template>

<script setup lang="ts">
import type { CarWashService } from '~/types/car-wash-services'
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'
import CarToWashAdditionalServicesForm from '~/components/cars-to-wash/forms/CarToWashAdditionalServicesForm.vue'
import CarToWashDetailCard from '~/components/cars-to-wash/cards/CarToWashDetailCard.vue'

const { showAlert, showConfirm } = useWebAppPopup()
const { sendData } = useWebApp()

const isCarWashChooseDialogVisible = ref<boolean>(false)

const serviceIdToCount = ref<Record<string, number>>({})


const runtimeConfig = useRuntimeConfig()

const route = useRoute()
const carId = Number(route.params.id as string)

const { data: carToWash, status: carToWashStatus } = await useFetch(`/shifts/cars/${carId}/`, {
  baseURL: runtimeConfig.public.apiBaseUrl,
})

const {
  data: carWashServices,
  refresh: refreshCarWashServices,
} = await useFetch((): string => `/car-washes/${carToWash.value.car_wash?.id}/services/`, {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { services: CarWashService[] }): CarWashService[] => data.services,
  query: { flat: true },
  immediate: false,
})

const serializedData = computed((): string => {
  return JSON.stringify({
    id: carToWash.value.id,
    additional_services: Object.entries(serviceIdToCount.value).map(([id, count]) => ({ id, count })),
  })
})


const submitConfirmMessage = computed((): string => {
  if (Object.keys(serviceIdToCount.value).length === 0) {
    return `Вы уверены? Вы не выбрали ни одну услугу и это действие удалит все ранее внесенные данные по автомобилю ${carToWash.value.number}`
  }
  return `Вы уверены? Это действие удалит все ранее внесенные данные по автомобилю ${carToWash.value.number}`
})

const onSubmitCarToWashWithAdditionalServices = (): void => {
  showConfirm?.(submitConfirmMessage.value, (ok: boolean): void => {
    if (!ok) return
    showAlert?.(`Данные по автомобилю ${carToWash.value!.number} записаны`)
    sendData?.(serializedData.value)
  })
}

watchEffect(async () => {
  if (carToWash.value!.car_wash === null) {
    isCarWashChooseDialogVisible.value = true
    return
  }
  await refreshCarWashServices()
  serviceIdToCount.value = Object.fromEntries(
    carToWash.value.additional_services.map((service) => [service.id, service.count]),
  )
})
</script>
