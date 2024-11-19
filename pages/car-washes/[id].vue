<template>
  <div class="flex flex-col gap-y-4">
    <h3 class="text-xl font-semibold">Прайс-лист в автомойке</h3>
    <template
      v-for="carWashService in allCarWashServices"
      :key="carWashService.id"
    >
      <div
        @click="onUpdateCarWashServiceModelValue(carWashService)"
        v-if="carWashService.is_countable !== undefined"
        class="flex items-center gap-x-2"
      >
        <ToggleSwitch
          :input-id="carWashService.id"
          :model-value="flattenCarWashServiceIds.includes(carWashService.id)"
          readonly
        />
        <label
          class="cursor-pointer"
          :for="carWashService.id"
        >
          {{ carWashService.name }}
        </label>
      </div>
      <Fieldset
        v-if="carWashService.children !== undefined"
        :legend="carWashService.name"
      >
      </Fieldset>
    </template>
    <CarWashServicePriceUpdateDialog
      :car-wash-service="carWashService"
      :price="1"
      v-model:visible="isDialogVisible"
      @submit="onUpdateCarWashServicePrice"
    />
  </div>
</template>

<script setup lang="ts">
import type { CarWashService } from '~/types/car-wash-services'
import CarWashServicePriceUpdateDialog from '~/components/dialogs/CarWashServicePriceUpdateDialog.vue'

const route = useRoute()

const runtimeConfig = useRuntimeConfig()

const carWashId = Number(route.params.id as string)


const {
  data: carWashServices,
  status: carWashServicesStatus,
  refresh,
} = await useFetch(`/car-washes/${carWashId}/services/`, {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { services: CarWashService[] }): CarWashService[] => data.services,
})
const { data: allCarWashServices, status: allCarWashServicesStatus } = await useFetch('/car-washes/services/', {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { services: CarWashService[] }): CarWashService[] => data.services,
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
  await $fetch(`/car-washes/${carWashId}/services/${carWashServiceId}/`, {
    method: 'PUT',
    baseURL: runtimeConfig.public.apiBaseUrl,
    body: { price },
  })
  await refresh()
}

const deleteCarWashService = async (carWashServiceId: string): Promise<void> => {
  await $fetch(`/car-washes/${carWashId}/services/${carWashServiceId}/`, {
    method: 'DELETE',
    baseURL: runtimeConfig.public.apiBaseUrl,
  })
  await refresh()
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
