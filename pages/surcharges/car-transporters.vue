<template>
  <div>
    <h1 class="text-xl font-semibold mb-3">Доплатить сотруднику</h1>
    <ProgressSpinner v-if="staffListStatus === 'pending'" />
    <Select
      v-else-if="staffListStatus === 'success'"
      v-model="selectedStaff"
      :options="staffList!"
      option-label="full_name"
      placeholder="Выберите сотрудника"
      fluid
      filter
      :filter-fields="['full_name', 'id']"
      filter-message="Поиск по ФИО, ID"
      empty-filter-message="Сотрудник не найден"
      empty-message="Нет сотрудников"
    />
    <div v-if="selectedStaff && surchargesStatus === 'success'" class="my-4">
      <CarTransporterSurchargeListDataView
        :car-transporter-surcharges="surcharges!"
        :staff="selectedStaff"
        @delete-surcharge="onDeleteSurcharge"
      />
      <Button
        rounded
        label="Добавить доплату"
        icon="pi pi-plus"
        severity="success"
        fluid
        class="mt-3"
        @click="isCreateDialogVisible = true"
      />
    </div>
    <CarTransporterSurchargeCreateDialog
      v-if="shiftsStatus === 'success'"
      v-model:visible="isCreateDialogVisible"
      :shifts="shifts!"
      @create-car-transporter-surcharge="onCreateSurcharge"
    />
  </div>
</template>

<script setup lang="ts">
import CarTransporterSurchargeListDataView from "~/components/data-views/CarTransporterSurchargeListDataView.vue"
import CarTransporterSurchargeCreateDialog from "~/components/dialogs/CarTransporterSurchargeCreateDialog.vue"
import { useWebAppPopup, useWebAppHapticFeedback } from "vue-tg"
import type {
  Surcharge,
  CarTransporterSurchargeCreateEvent,
} from "~/types/surcharges"
import type { StaffIdAndName } from "~/types/staff"
import type { ShiftListItem } from "~/types/shifts"

const runtimeConfig = useRuntimeConfig()

const isCreateDialogVisible = ref<boolean>(false)

const { notificationOccurred } = useWebAppHapticFeedback()
const { showConfirm, showAlert } = useWebAppPopup()

const selectedStaff = ref<StaffIdAndName | null>(null)
const { data: staffList, status: staffListStatus } = useFetch("/staff/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform(data: { staff: StaffIdAndName[] }) {
    return data.staff
  },
})

const surchargesQuery = computed(() => ({
  staff_ids: selectedStaff.value?.id,
  limit: 1000,
}))
const {
  data: surcharges,
  status: surchargesStatus,
  refresh: refreshSurcharges,
} = useFetch("/economics/surcharges/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: surchargesQuery,
  watch: [selectedStaff],
  immediate: false,
  transform(data: { surcharges: Surcharge[] }) {
    return data.surcharges
  },
})

const shiftsQuery = computed(() => {
  return {
    ...surchargesQuery.value,
    types: ['extra', 'regular', 'test'],
  }
})
const { data: shifts, status: shiftsStatus } = useFetch("/shifts/v2/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: shiftsQuery,
  immediate: false,
  watch: [selectedStaff],
  transform(data: { shifts: ShiftListItem[] }) {
    return data.shifts
  },
})

const onDeleteSurcharge = async (surchargeId: number) => {
  notificationOccurred("warning")
  showConfirm("Вы уверены что хотите удалить доплату?", async (ok: boolean) => {
    if (!ok) return
    await $fetch(`/economics/surcharges/${surchargeId}/`, {
      baseURL: runtimeConfig.public.apiBaseUrl,
      method: "DELETE",
      async onResponse({ response }) {
        if (!response.ok) return
        showAlert("❗️ Доплата удалена")
        notificationOccurred("success")
        await refreshSurcharges()
      },
      onResponseError() {
        showAlert("❌ Не удалось удалить доплату")
        notificationOccurred("error")
      },
    })
  })
}

const createSurcharge = async ({
  amount,
  reason,
  shiftId,
}: CarTransporterSurchargeCreateEvent): Promise<void> => {
  await $fetch("/economics/surcharges/", {
    baseURL: runtimeConfig.public.apiBaseUrl,
    method: "POST",
    body: {
      amount,
      reason,
      shift_id: shiftId,
    },
    async onResponse({ response }) {
      if (!response.ok) return
      showAlert(
        `❗️ Сотруднику ${selectedStaff.value?.full_name} доплачено ${amount} рублей`,
      )
      notificationOccurred("success")
      await refreshSurcharges()
    },
    onResponseError() {
      showAlert("❌ Не удалось доплатить сотруднику")
      notificationOccurred("error")
    },
  })
}

const onCreateSurcharge = ({
  amount,
  reason,
  shiftId,
}: CarTransporterSurchargeCreateEvent): void => {
  notificationOccurred("warning")
  showConfirm(
    `Вы уверены что хотите доплатить сотруднику ${selectedStaff.value?.full_name} ${amount} рублей?`,
    async (ok: boolean) => {
      if (!ok) return
      try {
        await createSurcharge({ amount, reason, shiftId })
      } finally {
        isCreateDialogVisible.value = false
      }
    },
  )
}
</script>
