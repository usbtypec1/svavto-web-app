<template>
  <div>
    <h1 class="text-xl font-semibold mb-3">Оштрафовать сотрудника</h1>
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
    <div v-if="selectedStaff && penaltiesStatus === 'success'" class="my-4">
      <CarTransporterPenaltyListDataView
        :car-transporter-penalties="penalties!"
        :staff="selectedStaff"
        @delete-penalty="onDeletePenalty"
      />
      <Button
        rounded
        label="Добавить штраф"
        icon="pi pi-plus"
        severity="danger"
        fluid
        class="mt-3"
        @click="isCreateDialogVisible = true"
      />
    </div>
    <CarTransporterPenaltyCreateDialog
      v-if="shiftsStatus === 'success'"
      v-model:visible="isCreateDialogVisible"
      :shifts="shifts!"
      @create-car-transporter-penalty="onCreatePenalty"
    />
  </div>
</template>

<script setup lang="ts">
import CarTransporterPenaltyCreateDialog from "~/components/dialogs/CarTransporterPenaltyCreateDialog.vue"
import CarTransporterPenaltyListDataView from "~/components/data-views/CarTransporterPenaltyListDataView.vue"
import { useWebAppPopup, useWebAppHapticFeedback } from "vue-tg"
import type {
  Penalty,
  CarTransporterPenaltyCreateEvent,
} from "~/types/penalties"
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

const penaltiesQuery = computed(() => ({
  staff_ids: selectedStaff.value?.id,
  limit: 1000,
}))
const {
  data: penalties,
  status: penaltiesStatus,
  refresh: refreshPenalties,
} = useFetch("/economics/penalties/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: penaltiesQuery,
  watch: [selectedStaff],
  immediate: false,
  transform(data: { penalties: Penalty[] }) {
    return data.penalties
  },
})

const { data: shifts, status: shiftsStatus } = useFetch("/shifts/v2/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: penaltiesQuery,
  immediate: false,
  watch: [selectedStaff],
  transform(data: { shifts: ShiftListItem[] }) {
    return data.shifts
  },
})

const onDeletePenalty = async (penaltyId: number) => {
  notificationOccurred("warning")
  showConfirm("Вы уверены что хотите удалить штраф?", async (ok: boolean) => {
    if (!ok) return
    await $fetch(`/economics/penalties/${penaltyId}/`, {
      baseURL: runtimeConfig.public.apiBaseUrl,
      method: "DELETE",
      async onResponse() {
        showAlert("❗️ Штраф удален")
        notificationOccurred("success")
        await refreshPenalties()
      },
      onResponseError() {
        showAlert("❌ Не удалось удалить штраф")
        notificationOccurred("error")
      },
    })
  })
}

const createPenalty = async ({
  amount,
  reason,
  shiftId,
}: CarTransporterPenaltyCreateEvent): Promise<void> => {
  await $fetch("/economics/penalties/", {
    baseURL: runtimeConfig.public.apiBaseUrl,
    method: "POST",
    body: {
      amount,
      reason,
      shift_id: shiftId,
    },
    async onResponse() {
      showAlert(`❗️ Сотрудник ${selectedStaff.value?.full_name} оштрафован`)
      notificationOccurred("success")
      await refreshPenalties()
    },
    onResponseError() {
      showAlert("❌ Не удалось оштрафовать сотрудника")
      notificationOccurred("error")
    },
  })
}

const onCreatePenalty = ({
  amount,
  reason,
  shiftId,
}: CarTransporterPenaltyCreateEvent): void => {
  notificationOccurred("warning")
  showConfirm(
    `Вы уверены что хотите оштрафовать сотрудника ${selectedStaff.value?.full_name} на сумму ${amount}?`,
    async (ok: boolean) => {
      if (!ok) return
      try {
        createPenalty({ amount, reason, shiftId })
      } finally {
        isCreateDialogVisible.value = false
      }
    },
  )
}
</script>
