<template>
  <div>
    <Title>Редактировать доп.услуги</Title>
    <p class="text-xl font-semibold mb-2">Редактировать доп.услуги</p>
    <p class="text-lg font-semibold mb-2">{{ carWash?.name }}</p>
    <CarToWashDetailCard :transferred-car="transferredCar!" />
    <p class="text-xl font-semibold mt-4 mb-2">Дополнительные услуги</p>
    <Card>
      <template #title>Долив воды/незамерзающей жидкости</template>
      <template #content>
        <WindshieldWasherSelect
          v-model="windshieldWasherRefilledBottlePercentage"
        />
      </template>
    </Card>
    <CarToWashAdditionalServicesForm
      v-model:service-id-to-count="serviceIdToCount"
      :specific-car-wash-services="carWash!.services"
      class="my-6"
    />
    <MainButton
      text="Подтвердить"
      @click="onSubmittransferredCarWithAdditionalServices"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp, useWebAppPopup } from "vue-tg"
import type { TransferredCarDetail } from "~/types/cars"
import type { CarWashWithServices } from "~/types/car-washes"
import WindshieldWasherSelect from "~/components/forms/WindshieldWasherSelect.vue"

const { showAlert, showConfirm } = useWebAppPopup()
const { sendData } = useWebApp()

const serviceIdToCount = ref<Record<string, number>>({})

const runtimeConfig = useRuntimeConfig()

const windshieldWasherRefilledBottlePercentage = ref<number>(0)

const route = useRoute()
const carId = Number(route.params.id as string)

const { data: transferredCar } = await useFetch<TransferredCarDetail>(
  `/shifts/cars/${carId}/`,
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
  },
)

const { data: carWash, refresh: refreshCarWash } =
  await useFetch<CarWashWithServices>(
    (): string => `/car-washes/${transferredCar.value!.car_wash_id}/`,
    {
      baseURL: runtimeConfig.public.apiBaseUrl,
      immediate: false,
    },
  )

watch(transferredCar, async (): Promise<void> => {
  if (transferredCar.value === null) return
  windshieldWasherRefilledBottlePercentage.value =
    transferredCar.value.windshield_washer_refilled_bottle_percentage

  await refreshCarWash()
  serviceIdToCount.value = Object.fromEntries(
    transferredCar.value.additional_services.map((service) => [
      service.id,
      service.count,
    ]),
  )
})

const serializedData = computed((): string => {
  return JSON.stringify({
    id: transferredCar.value!.id,
    additional_services: Object.entries(serviceIdToCount.value).map(
      ([id, count]) => ({ id, count }),
    ),
    windshield_washer_refilled_bottle_percentage:
      windshieldWasherRefilledBottlePercentage.value,
  })
})

const submitConfirmMessage = computed((): string => {
  if (Object.keys(serviceIdToCount.value).length === 0) {
    return `Вы уверены? Вы не выбрали ни одну услугу и это действие удалит все ранее внесенные данные по автомобилю ${
      transferredCar.value!.number
    }`
  }
  return `Вы уверены? Это действие обновит данные по автомобилю ${
    transferredCar.value!.number
  }. Ранее введенные данные сохраняться`
})

const onSubmittransferredCarWithAdditionalServices = (): void => {
  showConfirm?.(submitConfirmMessage.value, (ok: boolean): void => {
    if (!ok) return
    showAlert?.(`Данные по автомобилю ${transferredCar.value!.number} записаны`)
    sendData?.(serializedData.value)
  })
}
</script>
