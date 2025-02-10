<template>
  <div>
    <Title>Редактировать доп.услуги</Title>
    <p class="text-xl font-semibold mb-2">Редактировать доп.услуги</p>
    <p class="text-lg font-semibold mb-2">{{ carWash?.name }}</p>
    <ProgressSpinner v-if="carToWashStatus === 'pending'" />
    <CarToWashDetailCard
      v-else-if="carToWashStatus === 'success'"
      :car-to-wash="carToWash!"
    />
    <Message
      v-else-if="carToWashStatus === 'error'"
      severity="error"
      class="my-2"
    >
      Ошибка загрузки данных о машине
    </Message>

    <p class="text-xl font-semibold mt-4 mb-2">Дополнительные услуги</p>
    <Card>
      <template #title> Сколько % от бутылки было залито? </template>
      <template #content>
        <div v-if="carToWashStatus === 'success'">
          <Select
            v-model="windshieldWasherRefilledBottlePercentage"
            :options="windshieldWasherRefilledBottlePercentageOptions"
            fluid
            :default-value="carToWash!.windshield_washer_refilled_bottle_percentage"
          />
        </div>
      </template>
    </Card>

    <CarToWashAdditionalServicesForm
      v-if="carWashStatus === 'success'"
      v-model:service-id-to-count="serviceIdToCount"
      :specific-car-wash-services="carWash!.services"
      class="my-6"
    />
    <ProgressSpinner v-else-if="carWashStatus === 'pending'" />
    <Message
      v-else-if="carWashStatus === 'error'"
      severity="error"
      class="my-2"
    >
      Ошибка загрузки доп.услуг
    </Message>
    <MainButton
      text="Подтвердить"
      @click="onSubmitCarToWashWithAdditionalServices"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp, useWebAppPopup } from "vue-tg"
import CarToWashAdditionalServicesForm from "~/components/cars-to-wash/forms/CarToWashAdditionalServicesForm.vue"
import CarToWashDetailCard from "~/components/cars-to-wash/cards/CarToWashDetailCard.vue"
import type { CarToWashDetail } from "~/types/cars"
import type { CarWashWithServices } from "~/types/car-washes"
import { windshieldWasherRefilledBottlePercentageOptions } from "~/utils/car-transfers"

const { showAlert, showConfirm } = useWebAppPopup()
const { sendData } = useWebApp()

const isCarWashChooseDialogVisible = ref<boolean>(false)

const serviceIdToCount = ref<Record<string, number>>({})

const runtimeConfig = useRuntimeConfig()

const windshieldWasherRefilledBottlePercentage = ref<number>(0)

const route = useRoute()
const carId = Number(route.params.id as string)

const { data: carToWash, status: carToWashStatus } =
  await useFetch<CarToWashDetail>(`/shifts/cars/${carId}/`, {
    baseURL: runtimeConfig.public.apiBaseUrl,
  })

const {
  data: carWash,
  status: carWashStatus,
  refresh: refreshCarWash,
} = await useFetch<CarWashWithServices>(
  (): string => `/car-washes/${carToWash.value!.car_wash?.id}/`,
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
    immediate: false,
  },
)

const serializedData = computed((): string => {
  return JSON.stringify({
    id: carToWash.value!.id,
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
      carToWash.value!.number
    }`
  }
  return `Вы уверены? Это действие удалит все ранее внесенные данные по автомобилю ${
    carToWash.value!.number
  }`
})

const onSubmitCarToWashWithAdditionalServices = (): void => {
  showConfirm?.(submitConfirmMessage.value, (ok: boolean): void => {
    if (!ok) return
    showAlert?.(`Данные по автомобилю ${carToWash.value!.number} записаны`)
    sendData?.(serializedData.value)
  })
}

watchEffect(async () => {
  if (carToWash.value === null) return
  if (carToWash.value.car_wash === null) {
    isCarWashChooseDialogVisible.value = true
    return
  }
  await refreshCarWash()
  serviceIdToCount.value = Object.fromEntries(
    carToWash.value.additional_services.map((service) => [
      service.id,
      service.count,
    ]),
  )
})
</script>
