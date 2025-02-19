<template>
  <div class="flex flex-col gap-y-4">
    <template
      v-if="
        carWashSurchargesStatus !== 'pending' && carWashStatus !== 'pending'
      "
    >
      <h1 class="font-semibold text-xl mb-2">
        Доплатить мойке {{ carWash?.name }}
      </h1>
      <CarWashSurchargeListDataView
        @delete-surcharge="onDeleteSurcharge"
        :car-wash-surcharges="carWashSurcharges!"
      />
      <Button
        @click="isCarWashSurchargeCreateDialogVisible = true"
        label="Добавить доплату"
        size="large"
        icon="pi pi-plus"
        severity="success"
        fluid
        rounded
      />
      <CarWashSurchargeCreateDialog
        v-model:visible="isCarWashSurchargeCreateDialogVisible"
        @create-car-wash-surcharge="onCreateCarWashSurcharge"
      />
    </template>
    <ProgressSpinner v-else />
    <BackButton @click="navigateTo({ name: 'surcharges-car-wash' })" />
  </div>
</template>

<script setup lang="ts">
import type {
  CarWashSurcharge,
  CarWashSurchargeCreateEvent,
} from "~/types/surcharges"
import CarWashSurchargeCreateDialog from "~/components/dialogs/CarWashSurchargeCreateDialog.vue"
import { useWebAppPopup, BackButton } from "vue-tg"
import type { CarWashWithServices } from "~/types/car-washes"
import CarWashSurchargeListDataView from "~/components/data-views/CarWashSurchargeListDataView.vue"

const { showAlert, showConfirm } = useWebAppPopup()

const runtimeConfig = useRuntimeConfig()

const route = useRoute()

const carWashId = Number(route.params.id)

const isCarWashSurchargeCreateDialogVisible = ref<boolean>(false)

const {
  data: carWashSurcharges,
  status: carWashSurchargesStatus,
  refresh: refreshCarWashSurcharges,
} = useFetch("/economics/car-washes/surcharges", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: { car_wash_ids: [carWashId] },
  transform(data: { surcharges: CarWashSurcharge[] }) {
    return data.surcharges
  },
})
const { data: carWash, status: carWashStatus } = useFetch<CarWashWithServices>(
  `/car-washes/${carWashId}/`,
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
  },
)

const onCreateCarWashSurcharge = async ({
  amount,
  reason,
}: CarWashSurchargeCreateEvent): Promise<void> => {
  await $fetch("/economics/car-washes/surcharges/", {
    method: "POST",
    baseURL: runtimeConfig.public.apiBaseUrl,
    body: {
      car_wash_id: carWashId,
      amount,
      reason,
    },
    async onResponse() {
      await refreshCarWashSurcharges()
      showAlert(
        `✅ Мойке ${carWash.value!.name} успешно доплачено ${amount} рублей`,
      )
    },
    onResponseError() {
      showAlert(`❌ Не удалось доплатить мойке ${carWash.value?.name}`)
    },
  })
}

const onDeleteSurcharge = async (surchargeId: number): Promise<void> => {
  showConfirm(
    "❗️ Вы уверены что хотите удалить доплату?",
    async (ok: boolean): Promise<void> => {
      if (!ok) return
      await $fetch(`/economics/car-washes/surcharges/${surchargeId}/`, {
        method: "DELETE",
        baseURL: runtimeConfig.public.apiBaseUrl,
        async onResponse() {
          await refreshCarWashSurcharges()
          showAlert(`❗️ Доплата успешно удалена`)
        },
        onResponseError() {
          showAlert(`❌ Не удалось удалить доплату`)
        },
      })
    },
  )
}
</script>
