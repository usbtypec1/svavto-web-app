<template>
  <div class="flex flex-col gap-y-4">
    <h3 class="text-xl font-semibold">Прайс-лист в автомойке</h3>
    <Card
      v-for="[parentId, carWashServices] in Object.entries(carWashServicesToGroupedByParent)"
      :key="parentId"
    >
      <template
        v-if="parentId !== 'undefined'"
        #title
      >
        <p>{{ carWashServiceIdToName[parentId] }}</p>
      </template>
      <template #content>
        <div class="flex flex-col gap-y-4">
          <div
            @click="onUpdateCarWashServiceModelValue(carWashService)"
            class="flex justify-between items-center gap-x-2 border-t border-gray-200 dark:border-gray-600 pt-4 cursor-pointer"
            v-for="carWashService in carWashServices"
            :key="carWashService.id"
            :class="{ 'first:border-0': parentId === 'undefined'}"

          >
            <label
              class="cursor-pointer flex flex-col"
              :for="carWashService.id"
            >
              <span>{{ carWashService.name }}</span>
              <Message
                v-if="carWashServiceIdToPrice[carWashService.id]"
                size="small"
                variant="simple"
                severity="secondary"
              >
                {{ carWashServiceIdToPrice[carWashService.id] }} рублей
              </Message>
            </label>
            <ToggleSwitch
              :input-id="carWashService.id"
              :model-value="specificCarWashServiceIds.includes(carWashService.id)"
              readonly
            />
          </div>
        </div>
      </template>
    </Card>

    <CarWashServicePriceUpdateDialog
      :car-wash-service="carWashService"
      v-model:visible="isDialogVisible"
      @submit="onUpdateCarWashServicePrice"
    />

    <MainButton
      text="Закрыть"
      @click="close"
      :visible="!isDialogVisible"
    />
  </div>
</template>

<script setup lang="ts">
import type { CarWashService } from '~/types/car-wash-services'
import CarWashServicePriceUpdateDialog from '~/components/dialogs/CarWashServicePriceUpdateDialog.vue'
import { useWebAppHapticFeedback, useWebAppPopup, useWebApp, MainButton } from 'vue-tg'

const route = useRoute()

const runtimeConfig = useRuntimeConfig()

const carWashId = Number(route.params.id as string)

const { close } = useWebApp()
const { notificationOccurred } = useWebAppHapticFeedback()
const { showAlert } = useWebAppPopup()

const {
  data: specificCarWashServices,
  refresh,
} = await useFetch(`/car-washes/${carWashId}/services/`, {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { services: CarWashService[] }): CarWashService[] => data.services,
})
const { data: allCarWashServices } = await useFetch('/car-washes/services/', {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { services: CarWashService[] }): CarWashService[] => data.services,
})

const {
  idToName: carWashServiceIdToName,
  groupedByParentId: carWashServicesToGroupedByParent,
  idToPrice: carWashServiceIdToPrice,
} = useTransformedCarWashServices(allCarWashServices)

const {
  ids: specificCarWashServiceIds,
} = useTransformedCarWashServices(specificCarWashServices)

const isDialogVisible = ref<boolean>(false)
const carWashService = ref<CarWashService>()

const onUpdateCarWashServicePrice = async ({ carWashServiceId, price }: {
  carWashServiceId: string,
  price: number
}): Promise<void> => {
  try {
    await $fetch(`/car-washes/${carWashId}/services/${carWashServiceId}/`, {
      method: 'PUT',
      baseURL: runtimeConfig.public.apiBaseUrl,
      body: { price },
    })
    await refresh()
    notificationOccurred?.('success')
  } catch (error) {
    console.error(error)
    notificationOccurred?.('error')
    showAlert?.('Ошибка при обновлении цены')
  }
}

const deleteCarWashService = async (carWashServiceId: string): Promise<void> => {
  try {
    await $fetch(`/car-washes/${carWashId}/services/${carWashServiceId}/`, {
      method: 'DELETE',
      baseURL: runtimeConfig.public.apiBaseUrl,
    })
    await refresh()
    notificationOccurred?.('success')
  } catch (error) {
    console.error(error)
    notificationOccurred?.('error')
    showAlert?.('Ошибка при удалении услуги')
  }
}

const onUpdateCarWashServiceModelValue = async (service: CarWashService): Promise<void> => {
  const isToggled = specificCarWashServiceIds.value.includes(service.id)
  if (!isToggled) {
    carWashService.value = service
    isDialogVisible.value = true
  } else {
    await deleteCarWashService(service.id)
  }
}
</script>
