<template>
  <div class="flex flex-col gap-y-4">
    <h3 class="text-xl font-semibold">Прайс-лист в автомойке</h3>
    <Card
      v-for="[parentId, carWashServices] in Object.entries(carWashServicesGroupedByParent)"
      :key="parentId"
    >
      <template
        v-if="parentId !== 'undefined'"
        #title
      >
        <p>{{ carWashServiceIdToName[parentId] }}</p>
        <Divider/>
      </template>
      <template #content>
        <div class="flex flex-col gap-y-4">
          <div
            @click="onUpdateCarWashServiceModelValue(carWashService)"
            class="flex justify-between items-center gap-x-2"
            v-for="carWashService in carWashServices"
            :key="carWashService.id"
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
              :model-value="flattenCarWashServiceIds.includes(carWashService.id)"
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
  data: carWashServices,
  refresh,
} = await useFetch(`/car-washes/${carWashId}/services/`, {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: { flat: true },
  transform: (data: { services: CarWashService[] }): CarWashService[] => data.services,
})
const { data: allCarWashServices, status: allCarWashServicesStatus } = await useFetch('/car-washes/services/', {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: { flat: true },
  transform: (data: { services: CarWashService[] }): CarWashService[] => data.services,
})

const carWashServiceIdToPrice = computed((): Record<string, number> => {
  if (carWashServices.value === null) {
    return {}
  }
  const idToPrice = {}
  carWashServices.value.forEach((service) => {
    idToPrice[service.id] = service.price
  })
  return idToPrice
})

const carWashServiceIdToName = computed((): Record<string, string> => {
  if (allCarWashServices.value === null) {
    return {}
  }
  const idToName = {}
  allCarWashServices.value.forEach((service) => {
    idToName[service.id] = service.name
  })
  return idToName
})

const carWashServicesGroupedByParent = computed((): Record<string, CarWashService[]> => {
  if (allCarWashServices.value === null) {
    return {}
  }
  const grouped = {}
  allCarWashServices.value.forEach((service) => {
    if (!grouped[service.parent?.id]) {
      grouped[service.parent?.id] = []
    }
    grouped[service.parent?.id].push(service)

  })
  return grouped
})

const flattenCarWashServiceIds = computed((): string[] => {
  if (!carWashServices.value) {
    return []
  }
  const ids = []
  const extractIds = (service) => {
    ids.push(service.id)
    if (service.children && service.children.length > 0) {
      service.children.forEach(extractIds)
    }
  }
  carWashServices.value.forEach(extractIds)
  return ids
})

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
  const isToggled = flattenCarWashServiceIds.value.includes(service.id)
  if (!isToggled) {
    carWashService.value = service
    isDialogVisible.value = true
  } else {
    await deleteCarWashService(service.id)
  }
}
</script>
