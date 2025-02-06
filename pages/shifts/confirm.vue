<template>
  <div class="flex flex-col gap-y-3">
    <h3 class="text-center font-semibold text-2xl">Сегодня в смене</h3>
    <div class="flex flex-col gap-y-2">
      <label class="font-semibold">{{ calendarLabel }}</label>
      <DatePicker
        v-model="date"
        date-format="dd.mm.yy"
        :min-date="minDate"
        fluid
        inline
      />
    </div>
    <div v-auto-animate>
      <div v-if="!onlySpecificStaff" class="flex flex-col gap-y-1">
        <ProgressSpinner
          v-if="staffListOnSpecificShiftDateStatus === 'pending'"
        />
        <ShiftRequestPlannedOnDateStaffList
          v-else-if="staffListOnSpecificShiftDateStatus === 'success'"
          v-model="selectedStaffList"
          :staff-list="staffListOnSpecificShiftDate!"
        />
      </div>
    </div>
    <div class="flex flex-col gap-y-2">
      <Button
        @click="close"
        label="Закрыть"
        severity="danger"
        outlined
        icon="pi pi-times"
      />
      <ToggleButton
        v-model="onlySpecificStaff"
        on-label="Точечный запрос"
        off-label="Точечный запрос"
        on-icon="pi pi-check"
      />
    </div>

    <div v-auto-animate>
      <div v-if="onlySpecificStaff">
        <ProgressSpinner v-if="allStaffListStatus === 'pending'" />
        <ShiftRequestTargetedStaffList
          v-else-if="allStaffListStatus === 'success'"
          v-model="selectedStaffList"
          :staff-list="allStaffList!"
        />
        <Message
          v-else-if="allStaffListStatus === 'error'"
          severity="error"
          icon="pi pi-exclamation-triangle"
        >
          Не удалось загрузить список сотрудников
        </Message>
      </div>
    </div>
    <DevOnly>
      <Button
        @click="onConfirm"
        label="Подтвердить"
        :disabled="!isMainButtonVisible"
        fluid
      />
    </DevOnly>
    <MainButton
      @click="onConfirm"
      text="Подтвердить"
      :visible="isMainButtonVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp, useWebAppPopup } from "vue-tg"
import type { Staff, StaffIdAndName } from "~/types/staff"
import type { ShiftListItem, ShiftsConfirmation } from "~/types/shifts"
import { subDays } from "date-fns"
import ShiftRequestPlannedOnDateStaffList from "~/components/shift-request/ShiftRequestPlannedOnDateStaffList.vue"
import ShiftRequestTargetedStaffList from "~/components/shift-request/ShiftRequestTargetedStaffList.vue"

const minDate = subDays(new Date(), 1)

const { close, sendData } = useWebApp()
const { showConfirm } = useWebAppPopup()

const selectedStaffList = ref<StaffIdAndName[]>([])

const date = ref<Date>(new Date())

const humanizedDate = useDateFormat(date, "DD.MM.YYYY")

const formattedDate = useDateFormat(date, "YYYY-MM-DD")

const runtimeConfig = useRuntimeConfig()

const onlySpecificStaff = ref<boolean>(false)


const {
  data: allStaffList,
  status: allStaffListStatus,
} = useFetch("/staff/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: {
    order_by: "-created_at",
  },
  transform(data: { staff: Staff[] }): StaffIdAndName[] {
    return data.staff.map((staff: Staff) => ({
      id: staff.id,
      full_name: staff.full_name,
    }))
  },
})

const {
  data: staffListOnSpecificShiftDate,
  refresh: refreshStaffListOnSpecificShiftDate,
  status: staffListOnSpecificShiftDateStatus,
} = useFetch("/shifts/", {
  query: { date_from: formattedDate, date_to: formattedDate, limit: 1000 },
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform(data: { shifts: ShiftListItem[] }): StaffIdAndName[] {
    return data.shifts.map((shift: ShiftListItem) => ({
      id: shift.staff.id,
      full_name: shift.staff.full_name,
    }))
  },
})

watch(date, async () => {
  if (date.value) {
    await refreshStaffListOnSpecificShiftDate()
  }
})

watch(onlySpecificStaff, (): void => {
  selectedStaffList.value = []
})

const isMainButtonVisible = computed((): boolean => {
  if (onlySpecificStaff.value) {
    return selectedStaffList.value.length > 0
  }
  return !!date.value
})

const confirmationText = computed((): string => {
  if (onlySpecificStaff.value) {
    return "Вы уверены что хотите отправить запрос выбранным сотрудникам?"
  }
  return `Отправить запрос на дату ${humanizedDate.value} всем сотрудникам?`
})

const shiftsForDateToSend = computed((): ShiftsConfirmation => {
  return {
    date: formattedDate.value,
    staff_list: selectedStaffList.value,
  }
})

const calendarLabel = computed((): string => {
  return onlySpecificStaff.value
    ? "Дата на которую поставить смены"
    : "Дата на которую поставили смены"
})

const serializedData = computed((): string =>
  JSON.stringify(shiftsForDateToSend.value),
)

const onConfirm = (): void => {
  console.log(serializedData.value)
  showConfirm?.(confirmationText.value, (ok: boolean) => {
    if (!ok) return
    sendData?.(serializedData.value)
  })
}
</script>
