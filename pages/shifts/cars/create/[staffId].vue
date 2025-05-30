<template>
  <div>
    {{ currentShiftError }}
    <Title>Добавить машину</Title>
    <p class="text-xl font-semibold mb-2">Добавить авто</p>
    <p class="text-lg font-semibold mb-2">{{  carWash?.name  }}</p>
    <CarWashChooseDialog
      v-if="isCarWashChooseDialogVisible"
      @submit="refreshCurrentShift"
      v-model:visible="isCarWashChooseDialogVisible"
      :staff-id
    />
    <CarAddForm
      :is-additional-services-included="isAdditionalServicesIncluded"
      @submit-without-additional-services="onAddCarWithoutAdditionalServices"
      @submit-with-additional-services="onAddCarWithAdditionalServices"
      :is-windshield-washer-hidden="currentShift!.is_windshield_washer_hidden"
    />
    <template v-if="isAdditionalServicesIncluded">
      <CarToWashAdditionalServicesForm
        v-model:service-id-to-count="serviceIdToCount"
        :specific-car-wash-services="carWash?.services"
        class="my-6"
      />
      <MainButton
        text="Подтвердить"
        @click="onSubmitCarToWashWithAdditionalServices"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import CarWashChooseDialog from "~/components/dialogs/CarWashChooseDialog.vue"
import type { CarToWash } from "~/types/cars"
import type { CarWashWithServices } from "~/types/car-washes"
import CarAddForm from "~/components/forms/CarAddForm.vue"
import { MainButton, useWebApp, useWebAppPopup } from "vue-tg"
import CarToWashAdditionalServicesForm from "~/components/forms/CarToWashAdditionalServicesForm.vue"
import { getErrorCodes } from "~/utils/errors"
import type { CurrentShift } from "~/types/shifts"

const { showAlert, showConfirm } = useWebAppPopup()
const { sendData } = useWebApp()

const isCarWashChooseDialogVisible = ref<boolean>(false)
const isAdditionalServicesIncluded = ref<boolean>(false)

const onAddCarWithoutAdditionalServices = (car: CarToWash): void => {
  showConfirm?.(
    `Записать автомобиль ${car.number} в список выполненных?`,
    (ok: boolean): void => {
      if (!ok) return
      showAlert?.(`Данные по автомобилю ${car.number} записаны`)
      sendData?.(
        JSON.stringify({
          number: car.number,
          class_type: car.classType,
          wash_type: car.washType,
          windshield_washer_type: car.windshieldWasherType,
          windshield_washer_refilled_bottle_percentage:
            car.windshieldWasherRefilledBottlePercentage,
          additional_services: [],
        }),
      )
    },
  )
}

const carToWash = ref<CarToWash>()
const serviceIdToCount = ref<Record<string, number>>({})

const onAddCarWithAdditionalServices = (car: CarToWash): void => {
  isAdditionalServicesIncluded.value = true
  carToWash.value = car
}

const onSubmitCarToWashWithAdditionalServices = (): void => {
  showConfirm?.(
    `Записать автомобиль ${carToWash.value!.number} в список выполненных?`,
    (ok: boolean): void => {
      if (!ok) return
      showAlert?.(`Данные по автомобилю ${carToWash.value!.number} записаны`)
      sendData?.(
        JSON.stringify({
          number: carToWash.value!.number,
          class_type: carToWash.value!.classType,
          wash_type: carToWash.value!.washType,
          windshield_washer_type: carToWash.value!.windshieldWasherType,
          windshield_washer_refilled_bottle_percentage:
            carToWash.value!.windshieldWasherRefilledBottlePercentage,
          additional_services: Object.entries(serviceIdToCount.value).map(
            ([id, count]) => ({ id, count }),
          ),
        }),
      )
    },
  )
}

const runtimeConfig = useRuntimeConfig()

const route = useRoute()
const staffId = Number(route.params.staffId as string)

const {
  data: currentShift,
  error: currentShiftError,
  refresh: refreshCurrentShift,
} = await useFetch<CurrentShift>(`/shifts/current/${staffId}/`, {
  baseURL: runtimeConfig.public.apiBaseUrl,
})

const {
  data: carWash,
  refresh: refreshCarWash,
} = await useFetch<CarWashWithServices>(
  (): string => `/car-washes/${currentShift.value?.car_wash?.id}/`,
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
    immediate: false,
    watch: [currentShift],
  },
)

watchEffect(async () => {
  const errorCodes = getErrorCodes(currentShiftError.value?.data)
  if (errorCodes.includes("staff_has_no_active_shift")) {
    await navigateTo({ name: "shifts-no-active" })
    return
  }
  if (currentShift.value!.car_wash === null) {
    isCarWashChooseDialogVisible.value = true
    return
  }
  await refreshCarWash()
})
</script>
