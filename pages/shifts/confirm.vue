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
      <div v-if="!isTargetedStaffMode" class="flex flex-col gap-y-1">
        <ProgressSpinner v-if="shiftsStatus === 'pending'" />
        <ShiftRequestPlannedOnDateStaffList
          v-else-if="shiftsStatus === 'success'"
          v-model="selectedStaffList"
          :staff-list="staffListForDate"
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
        v-model="isTargetedStaffMode"
        on-label="Точечный запрос"
        off-label="Точечный запрос"
        on-icon="pi pi-check"
      />
    </div>
    <div v-auto-animate>
      <div v-if="isTargetedStaffMode">
        <ProgressSpinner v-if="allStaffListStatus === 'pending'" />
        <ShiftRequestTargetedStaffList
          v-else-if="allStaffListStatus === 'success'"
          v-model:selected-staff-list="selectedStaffList"
          :staff-list="allStaffList!"
          :staff-ids-with-shift-for-date="staffIdsWithShiftForDate"
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
import type { StaffIdAndName } from "~/types/staff"
import { subDays } from "date-fns"
import ShiftRequestPlannedOnDateStaffList from "~/components/shift-request/ShiftRequestPlannedOnDateStaffList.vue"
import ShiftRequestTargetedStaffList from "~/components/shift-request/ShiftRequestTargetedStaffList.vue"

const minDate = subDays(new Date(), 1)

const { close, sendData } = useWebApp()
const { showConfirm } = useWebAppPopup()

const selectedStaffList = ref<StaffIdAndName[]>([])

const date = ref<Date>(new Date())

const isTargetedStaffMode = ref<boolean>(false)

const { data: allStaffList, status: allStaffListStatus } = useStaffList()
const {
  status: shiftsStatus,
  staffIds: staffIdsWithShiftForDate,
  staffList: staffListForDate,
} = useShifts(date)

watch(staffListForDate, (): void => {
  if (shiftsStatus.value === "success") {
    selectedStaffList.value = staffListForDate.value
  }
})

watch(isTargetedStaffMode, (): void => {
  if (!isTargetedStaffMode.value) {
    selectedStaffList.value = staffListForDate.value
  } else {
    selectedStaffList.value = []
  }
})

const isMainButtonVisible = computed((): boolean => {
  if (isTargetedStaffMode.value) {
    return selectedStaffList.value.length > 0
  }
  return !!date.value
})

const { confirmationText, calendarLabel } = useShiftConfirmationLabels({
  isTargetedStaffMode: isTargetedStaffMode,
  date,
  selectedStaffList,
})

const { serializedData } = useShiftConfirmationDataToSend({
  date,
  selectedStaffList,
})

const onConfirm = (): void => {
  showConfirm?.(confirmationText.value, (ok: boolean) => {
    if (!ok) return
    sendData?.(serializedData.value)
  })
}
</script>
