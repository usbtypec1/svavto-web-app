<template>
  <div>
    <Title>Добавить машину</Title>
    <p class="text-xl font-semibold mb-2">Добавить авто</p>
    <CarWashChooseDialog
      @submit="refreshCurrentShift"
      v-model:visible="isCarWashChooseDialogVisible"
    />
    <CarToWashAdditionalServiceCountDialog
      v-model:visible="isCarToWashAdditionalServiceCountDialogVisible"
      v-model:service-id-to-count="serviceIdToCount"
      :car-wash-service="carWashServicePassedToDialog!"
    />
    <CarAddForm
      :is-additional-services-included="isAdditionalServicesIncluded"
      @submit-without-additional-services="onAddCarWithoutAdditionalServices"
      @submit-with-additional-services="onAddCarWithAdditionalServices"
    />

    <div class="my-6">
      <p class="text-xl font-semibold mb-2">Дополнительные услуги</p>
      <div class="flex flex-col gap-y-6">
        <Card
          v-for="[serviceParentId, services] in Object.entries(allCarWashServicesGroupedByParentId)"
          :key="serviceParentId"
        >
          <template
            #title
            v-if="serviceParentId !== 'undefined'"
          >
            {{ allCarWashServicesIdToName[serviceParentId] }}
          </template>
          <template #content>
            <div class="flex flex-col gap-y-4">
              <div
                @click="onUpdateCarToWashAdditionalServiceCountModelValue(service)"
                v-for="service in services"
                :key="service.id"
                class="flex justify-between items-center border-t border-gray-600 pt-4 cursor-pointer"
                :class="{ 'first:border-0': serviceParentId === 'undefined'}"
              >
                <label :for="service.id" class="flex flex-col cursor-pointer">
                  <span>{{ service.name }}</span>
                  <Message
                    v-if="service.is_countable && service.id in serviceIdToCount"
                    variant="simple"
                    severity="secondary"
                    size="small"
                  >
                    {{ serviceIdToCount[service.id] }} шт.
                  </Message>
                </label>
                <ToggleSwitch
                  :input-id="service.id"
                  :model-value="service.id in serviceIdToCount"
                  readonly
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CurrentShift } from '~/types/shifts'
import CarWashChooseDialog from '~/components/car-washes/dialogs/CarWashChooseDialog.vue'
import type { CarWashService } from '~/types/car-wash-services'
import { useTransformedCarWashServices } from '~/composables/car-wash-services'
import CarAddForm from '~/components/forms/CarAddForm.vue'
import type { CarToWash } from '~/types/cars'
import { useWebAppPopup, useWebApp } from 'vue-tg'
import CarToWashAdditionalServiceCountDialog
  from '~/components/cars-to-wash/dialogs/CarToWashAdditionalServiceCountDialog.vue'

const { showAlert, showConfirm } = useWebAppPopup()
const { sendData } = useWebApp()

const serviceIdToCount = ref<Record<string, number>>({})

const isCarToWashAdditionalServiceCountDialogVisible = ref<boolean>(false)
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
      additionalServices: [],
    }))
  })
}

const onAddCarWithAdditionalServices = (car: CarToWash): void => {
  console.log(car)
  isAdditionalServicesIncluded.value = true
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

const {
  data: specificCarWashServices,
  refresh: refreshSpecificCarWashServices,
} = useFetch(() => `/car-washes/${currentShift.value.car_wash.id}/services/`, {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { services: CarWashService[] }): CarWashService[] => data.services,
  query: { flat: true },
  immediate: false,
})

const currentShiftErrorCodes = computed((): string[] => {
  if (currentShiftError.value === null) return []
  return currentShiftError.value!.data.errors.map(({ code }) => code)
})


const {
  groupedByParentId: allCarWashServicesGroupedByParentId,
  idToName: allCarWashServicesIdToName,
} = useTransformedCarWashServices(carWashServices)

const {
  ids: specificCarWashServiceIds,
} = useTransformedCarWashServices(specificCarWashServices)


watchEffect(async () => {
  if (currentShiftErrorCodes.value.includes('staff_has_no_active_shift')) {
    await navigateTo({ name: 'shifts-no-active' })
    return
  }
  if (currentShift.value!.car_wash === null) {
    isCarWashChooseDialogVisible.value = true
    return
  }
  await refreshCarWashServices()
  await refreshSpecificCarWashServices()
})

const carWashServicePassedToDialog = ref<CarWashService | null>(null)

const onUpdateCarToWashAdditionalServiceCountModelValue = async (service: CarWashService): Promise<void> => {
  const isToggled = specificCarWashServiceIds.value.includes(service.id)
  if (!isToggled) {
    if (service.is_countable) {
      carWashServicePassedToDialog.value = service
      isCarToWashAdditionalServiceCountDialogVisible.value = true
    } else {
      serviceIdToCount.value[service.id] = 1
    }
  } else {
  }
}
</script>
