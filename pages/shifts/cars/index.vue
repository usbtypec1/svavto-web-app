<template>
  <div>
    <Title>Добавить машину</Title>
    <p class="text-xl font-semibold mb-2">Добавить авто</p>
    <CarWashChooseDialog
      @submit="refreshCurrentShift"
      v-model:visible="isCarWashChooseDialogVisible"
    />
    <CarAddForm
      :is-additional-services-included="isAdditionalServicesIncluded"
      @submit-without-additional-services="onAddCarWithoutAdditionalServices"
      @submit-with-additional-services="onAddCarWithAdditionalServices"
    />
    <CarToWashAdditionalServicesForm
      v-if="isAdditionalServicesIncluded"
      v-model:service-id-to-count="serviceIdToCount"
      :car-wash-services="carWashServices"
      class="my-6"
    />
  </div>
</template>

<script setup lang="ts">
import type { CurrentShift } from '~/types/shifts'
import CarWashChooseDialog from '~/components/car-washes/dialogs/CarWashChooseDialog.vue'
import type { CarWashService } from '~/types/car-wash-services'
import CarAddForm from '~/components/cars-to-wash/forms/CarAddForm.vue'
import type { CarToWash } from '~/types/cars'
import { useWebAppPopup, useWebApp } from 'vue-tg'
import CarToWashAdditionalServicesForm from '~/components/cars-to-wash/forms/CarToWashAdditionalServicesForm.vue'
import { getErrorCodes } from '~/utils/errors'

const { showAlert, showConfirm } = useWebAppPopup()
const { sendData } = useWebApp()

const isCarWashChooseDialogVisible = ref<boolean>(false)
const isAdditionalServicesIncluded = ref<boolean>(false)

const onAddCarWithoutAdditionalServices = (car: CarToWash): void => {
  showConfirm?.(`Записать автомобиль ${car.number} в список выполненных?`, (ok: boolean): void => {
    if (!ok) return
    showAlert?.(`Данные по автомобилю ${car.number} записаны`)
    sendData?.(JSON.stringify({
      number: car.number,
      class_type: car.classType,
      wash_type: car.washType,
      windshield_washer_refilled_bottle_percentage: car.windshieldWasherRefilledBottlePercentage,
      additional_services: [],
    }))
  })
}

const carToWash = ref<CarToWash>()
const serviceIdToCount = ref<Record<string, number>>({})

const onAddCarWithAdditionalServices = (car: CarToWash): void => {
  isAdditionalServicesIncluded.value = true
  carToWash.value = car
}

const onSubmitCarToWashWithAdditionalServices = (): void => {
  showConfirm?.(`Записать автомобиль ${carToWash.value!.number} в список выполненных?`, (ok: boolean): void => {
    if (!ok) return
    showAlert?.(`Данные по автомобилю ${carToWash.value!.number} записаны`)
    sendData?.(JSON.stringify({
      number: carToWash.value!.number,
      class_type: carToWash.value!.classType,
      wash_type: carToWash.value!.washType,
      windshield_washer_refilled_bottle_percentage: carToWash.value!.windshieldWasherRefilledBottlePercentage,
      additional_services: Object.entries(serviceIdToCount.value).map(([id, count]) => ({ id, count })),
    }))
  })
}

const runtimeConfig = useRuntimeConfig()

const userId = inject(userIdKey)

const {
  data: currentShift,
  error: currentShiftError,
  refresh: refreshCurrentShift,
} = await useFetch<CurrentShift>(`/shifts/current/${userId}/`, {
  baseURL: runtimeConfig.public.apiBaseUrl,
})

const {
  data: carWashServices,
  refresh: refreshCarWashServices,
} = useFetch('/car-washes/services/', {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { services: CarWashService[] }): CarWashService[] => data.services,
  query: { flat: true },
  immediate: false,
})

watchEffect(async () => {
  const errorCodes = getErrorCodes(currentShiftError.value?.data)
  if (errorCodes.includes('staff_has_no_active_shift')) {
    await navigateTo({ name: 'shifts-no-active' })
    return
  }
  if (currentShift.value!.car_wash === null) {
    isCarWashChooseDialogVisible.value = true
    return
  }
  await refreshCarWashServices()
})
</script>
