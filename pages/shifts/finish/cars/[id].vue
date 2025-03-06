<template>
  <div>
    <TransferredCarUpdateForm
      @submit="onSubmit"
      :transferred-car="transferredCar!"
      :car-wash-services="carWashServices!"
      :car-washes="carWashes!"
      v-model:car-wash-id="carWashId"
    />
    <BackButton @click="onNavigateToBackPage" />
  </div>
</template>

<script setup lang="ts">
import { BackButton } from "vue-tg"
import type {
  TransferredCarDetail,
  TransferredCarUpdateEvent,
} from "~/types/cars"
import TransferredCarUpdateForm from "~/components/forms/TransferredCarUpdateForm.vue"
import type { CarWashService } from "~/types/car-wash-services"
import { useWebAppPopup } from "vue-tg"
import type { CarWashIdAndName } from "~/types/car-washes"

const { showAlert } = useWebAppPopup()

const route = useRoute()
const transferredCarId = Number(route.params.id as string)

const runtimeConfig = useRuntimeConfig()

const carWashId = ref<number>()
const { data: transferredCar, status: transferredCarStatus } =
  await useFetch<TransferredCarDetail>(`/shifts/cars/${transferredCarId}/`, {
    baseURL: runtimeConfig.public.apiBaseUrl,
    transform(data: TransferredCarDetail) {
      carWashId.value = data.car_wash_id
      return data
    },
  })

const onNavigateToBackPage = async () => {
  await navigateTo({
    name: "shifts-finish-userId",
    params: { userId: transferredCar.value!.staff_id },
  })
}

const { data: carWashServices, status: carWashServicesStatus } = await useFetch(
  "/car-washes/services/",
  {
    query: { car_wash_ids: carWashId },
    baseURL: runtimeConfig.public.apiBaseUrl,
    transform(data: { services: CarWashService[] }) {
      return data.services
    },
  },
)
const { data: carWashes, status: carWashesStatus } = await useFetch(
  "/car-washes/",
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
    transform(data: { car_washes: CarWashIdAndName[] }): CarWashIdAndName[] {
      return data.car_washes
    },
  },
)

const onSubmit = async (values: TransferredCarUpdateEvent) => {
  await $fetch(`/shifts/cars/${transferredCarId}/`, {
    method: "PATCH",
    body: {
      car_wash_id: values.carWashId,
      number: values.number,
      class_type: values.classType,
      wash_type: values.washType,
      windshield_washer_refilled_bottle_percentage:
        values.windshieldWasherRefilledBottlePercentage,
      additional_services: values.additionalServices,
    },
    baseURL: runtimeConfig.public.apiBaseUrl,
    async onResponse({ response }) {
      if (response.ok) {
        showAlert(`Данные по авто ${values.number} успешно обновлены`)
        await onNavigateToBackPage()
      } else {
        showAlert(`Ошибка при обновлении данных по авто ${values.number}`)
      }
    },
  })
}
</script>
