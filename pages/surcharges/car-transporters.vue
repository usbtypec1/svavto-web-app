<template>
  <div>
    <h1 class="text-xl font-semibold mb-3">Доплатить сотруднику</h1>
    <Select
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
      v-if="selectedStaff"
      v-model:visible="isCreateDialogVisible"
      :staff-id="selectedStaff!.id"
      @create-car-transporter-surcharge="onCreateSurcharge"
    />
  </div>
</template>

<script setup lang="ts">
import { useWebAppPopup, useWebAppHapticFeedback } from "vue-tg"
import type {
  CarTransporterSurcharge,
  CarTransporterSurchargeCreateEvent,
} from "~/types/surcharges"
import type { StaffIdAndName } from "~/types/staff"
import { format } from "date-fns"

const runtimeConfig = useRuntimeConfig()

const isCreateDialogVisible = ref<boolean>(false)

const { notificationOccurred } = useWebAppHapticFeedback()
const { showConfirm, showAlert } = useWebAppPopup()

const selectedStaff = ref<StaffIdAndName | null>(null)
const { data: staffList } = await useFetch("/staff/", {
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
} = useFetch("/economics/car-transporters/surcharges/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: surchargesQuery,
  watch: [selectedStaff],
  immediate: false,
  transform(data: { surcharges: CarTransporterSurcharge[] }) {
    return data.surcharges
  },
})

const onDeleteSurcharge = async (surchargeId: number) => {
  notificationOccurred("warning")
  showConfirm("Вы уверены что хотите удалить доплату?", async (ok: boolean) => {
    if (!ok) return
    await $fetch(`/economics/car-transporters/surcharges/${surchargeId}/`, {
      baseURL: runtimeConfig.public.apiBaseUrl,
      method: "DELETE",
      async onResponse({ response }) {
        if (!response.ok) return
        await refreshSurcharges()
        showAlert("❗️ Доплата удалена")
        notificationOccurred("success")
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
  staffId,
  date,
}: CarTransporterSurchargeCreateEvent): Promise<void> => {
  await $fetch("/economics/car-transporters/surcharges/", {
    baseURL: runtimeConfig.public.apiBaseUrl,
    method: "POST",
    body: {
      amount,
      reason,
      date: format(date, "yyyy-MM-dd"),
      staff_id: staffId,
    },
    async onResponse({ response }) {
      if (!response.ok) return
      await refreshSurcharges()
      showAlert(
        `❗️ Сотруднику ${selectedStaff.value?.full_name} доплачено ${amount} рублей`,
      )
      notificationOccurred("success")
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
  staffId,
  date,
}: CarTransporterSurchargeCreateEvent): void => {
  notificationOccurred("warning")
  showConfirm(
    `Вы уверены что хотите доплатить сотруднику ${selectedStaff.value?.full_name} ${amount} рублей?`,
    async (ok: boolean) => {
      if (!ok) return
      try {
        await createSurcharge({ amount, reason, staffId, date })
      } finally {
        isCreateDialogVisible.value = false
      }
    },
  )
}
</script>
