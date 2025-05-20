<template>
  <div class="flex flex-col gap-y-4">
    <h3 class="text-xl font-semibold">Прайс-лист в автомойке</h3>

    <Card>
      <template #title> Основные настройки </template>
      <template #content>
        <CarWashForm
          @submit="onSaveCarWash"
          :is-loading="isCarWashFormLoading"
          :initial-values="initialValues"
        />
      </template>
    </Card>

    <h4 class="text-lg font-semibold">Доп.услуги</h4>
    <Card
      v-for="[parentId, carWashServices] in Object.entries(
        carWashServicesToGroupedByParent,
      )"
      :key="parentId"
    >
      <template v-if="parentId !== 'undefined'" #title>
        <p>{{ carWashServiceIdToName[parentId] }}</p>
      </template>
      <template #content>
        <div class="flex flex-col gap-y-4">
          <div
            @click="onUpdateCarWashServiceModelValue(carWashService)"
            class="flex justify-between items-center gap-x-2 border-t border-gray-200 dark:border-gray-600 pt-4 cursor-pointer"
            v-for="carWashService in carWashServices"
            :key="carWashService.id"
            :class="{ 'first:border-0': parentId === 'undefined' }"
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
              :model-value="
                specificCarWashServiceIds.includes(carWashService.id)
              "
              readonly
            />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #content>
        <div class="flex justify-between items-center">
          <Message
            severity="warn"
            icon="pi pi-exclamation-triangle"
            variant="simple"
          >
            Скрыть мойку от сотрудников
          </Message>
          <ToggleSwitch
            :model-value="carWash!.is_hidden"
            @update:model-value="onUpdateIsHidden"
          />
        </div>
      </template>
    </Card>

    <Button
      @click="onDeleteCarWash"
      fluid
      label="Удалить автомойку"
      icon="pi pi-trash"
      severity="danger"
      class="mt-2 mb-4"
    />

    <FloatingCornerButton page-name="car-washes" severity="primary" />

    <CarWashServicePriceUpdateDialog
      :car-wash-service="carWashService"
      v-model:visible="isDialogVisible"
      @submit="onUpdateCarWashServicePrice"
    />

    <MainButton text="Закрыть" @click="close" :visible="!isDialogVisible" />
  </div>
</template>

<script setup lang="ts">
import type { CarWashService } from "~/types/car-wash-services"
import {
  useWebAppHapticFeedback,
  useWebAppPopup,
  useWebApp,
  MainButton,
} from "vue-tg"
import type { CarWashFormValues, CarWashWithServices } from "~/types/car-washes"

const route = useRoute()

const runtimeConfig = useRuntimeConfig()

const carWashId = Number(route.params.id as string)

const isCarWashFormLoading = ref<boolean>(false)

const { close } = useWebApp()
const { notificationOccurred } = useWebAppHapticFeedback()
const { showAlert, showConfirm } = useWebAppPopup()

const { data: carWash, refresh } = await useApi<CarWashWithServices>(
  `/car-washes/${carWashId}/`,
)

const { data: allCarWashServices } = await useApi("/car-washes/services/", {
  transform: (data: any): CarWashService[] => data.services,
})

const initialValues = computed((): CarWashFormValues | undefined => {
  if (!carWash.value) return
  return {
    name: carWash.value.name,
    car_transporters_comfort_class_car_washing_price:
      carWash.value.car_transporters_comfort_class_car_washing_price,
    car_transporters_business_class_car_washing_price:
      carWash.value.car_transporters_business_class_car_washing_price,
    car_transporters_van_washing_price:
      carWash.value.car_transporters_van_washing_price,
    car_transporters_and_washers_comfort_class_price:
      carWash.value.car_transporters_and_washers_comfort_class_price,
    car_transporters_and_washers_business_class_price:
      carWash.value.car_transporters_and_washers_business_class_price,
    car_transporters_and_washers_van_price:
      carWash.value.car_transporters_and_washers_van_price,
    windshield_washer_price_per_bottle:
      carWash.value.windshield_washer_price_per_bottle,
  }
})

const services = computed(() => carWash?.value?.services ?? [])

const {
  idToName: carWashServiceIdToName,
  groupedByParentId: carWashServicesToGroupedByParent,
} = useTransformedCarWashServices(allCarWashServices)

const { ids: specificCarWashServiceIds, idToPrice: carWashServiceIdToPrice } =
  useTransformedCarWashServices(services)

const isDialogVisible = ref<boolean>(false)
const carWashService = ref<CarWashService>()

const onUpdateCarWashServicePrice = async ({
  carWashServiceId,
  price,
}: {
  carWashServiceId: string
  price: number
}): Promise<void> => {
  try {
    await $fetch(`/car-washes/${carWashId}/services/${carWashServiceId}/`, {
      method: "PUT",
      baseURL: runtimeConfig.public.apiBaseUrl,
      body: { price },
    })
    await refresh()
    notificationOccurred?.("success")
  } catch (error) {
    console.error(error)
    notificationOccurred?.("error")
    showAlert?.("Ошибка при обновлении цены")
  }
}

const deleteCarWashService = async (
  carWashServiceId: string,
): Promise<void> => {
  try {
    await $fetch(`/car-washes/${carWashId}/services/${carWashServiceId}/`, {
      method: "DELETE",
      baseURL: runtimeConfig.public.apiBaseUrl,
    })
    await refresh()
    notificationOccurred?.("success")
  } catch (error) {
    console.error(error)
    notificationOccurred?.("error")
    showAlert?.("Ошибка при удалении услуги")
  }
}

const onUpdateCarWashServiceModelValue = async (
  service: CarWashService,
): Promise<void> => {
  const isToggled = specificCarWashServiceIds.value.includes(service.id)
  if (!isToggled) {
    carWashService.value = service
    isDialogVisible.value = true
  } else {
    await deleteCarWashService(service.id)
  }
}

const onSaveCarWash = async (values: CarWashFormValues): Promise<void> => {
  console.log("Submit car wash update form", values)
  isCarWashFormLoading.value = true
  try {
    await $fetch(`/car-washes/${carWashId}/`, {
      method: "PUT",
      baseURL: runtimeConfig.public.apiBaseUrl,
      body: { ...carWash.value, ...values },
    })
    await refresh()
    notificationOccurred?.("success")
    showAlert?.("Автомойка обновлена")
  } catch (error) {
    showAlert?.(`Ошибка при обновлении автомойки: ${error}`)
    notificationOccurred?.("error")
    console.error("Error while updating car wash", error)
  } finally {
    isCarWashFormLoading.value = false
  }
}

const deleteCarWash = async (): Promise<void> => {
  try {
    await $fetch(`/car-washes/${carWashId}/`, {
      baseURL: runtimeConfig.public.apiBaseUrl,
      method: "DELETE",
    })
    await navigateTo({ name: "car-washes" })
    notificationOccurred?.("success")
  } catch (error: unknown) {
    console.error("Error while deleting car wash", error)
    showAlert("Ошибка при удалении автомойки")
    notificationOccurred?.("error")
  }
}

const onDeleteCarWash = async (): Promise<void> => {
  showConfirm(
    "Вы уверены, что хотите удалить автомойку?",
    async (ok: boolean): Promise<void> => {
      if (!ok) return
      await deleteCarWash()
    },
  )
}

const onUpdateIsHidden = async (isHidden: boolean): Promise<void> => {
  try {
    await $fetch(`/car-washes/${carWashId}/`, {
      method: "PUT",
      baseURL: runtimeConfig.public.apiBaseUrl,
      body: {
        ...carWash.value,
        is_hidden: isHidden,
      },
    })
    await refresh()
    notificationOccurred?.("success")
    if (isHidden) {
      showAlert?.("Мойка скрыта от сотрудников")
    } else {
      showAlert?.("Мойка показана сотрудникам")
    }
  } catch (error) {
    notificationOccurred?.("error")
    if (isHidden) {
      showAlert?.("Не удалось скрыть мойку")
    } else {
      showAlert?.("Не удалось показать мойку")
    }
  }
}
</script>
