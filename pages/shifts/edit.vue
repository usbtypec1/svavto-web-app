<template>
  <div class="flex flex-col gap-y-4">
    <PageHeader text="Редактирование графика смен" />
    <div class="flex flex-col gap-2">
      <label for="staff">Сотрудник</label>
      <Select
        v-model="staffId"
        :options="staffList!"
        option-label="full_name"
        option-value="id"
        input-id="staff"
        filter
        filter-placeholder="Поиск по ФИО, ID"
        :filter-fields="['full_name', 'id']"
        empty-filter-message="Сотрудник не найден"
        empty-selection-message="Выберите сотрудника"
        empty-message="Нет доступных сотрудников"
      />
    </div>
    <template v-if="staffId">
      <div class="flex flex-col gap-2">
        <label for="month">Месяц</label>
        <DatePicker
          v-model="selectedMonth"
          view="month"
          date-format="MM - yy год"
        />
      </div>
      <div class="flex flex-col gap-2">
        <p>График смен</p>
        <DatePicker
          :model-value="shiftDates"
          @update:model-value="onUpdate"
          @date-select="onDateSelect"
          selection-mode="multiple"
          inline
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="shiftsStatus !== 'success'"
        />
        <Message
          v-if="shiftsStatus === 'error'"
          severity="error"
          icon="pi pi-exclamation-triangle"
        >
          Не удалось загрузить график смен сотрудника
        </Message>
      </div>
    </template>
    <MainButton text="Готово" @click="close" />
  </div>
</template>

<script setup lang="ts">
import type { ShiftListItem } from "~/types/shifts"
import {
  MainButton,
  useWebApp,
  useWebAppHapticFeedback,
  useWebAppPopup,
} from "vue-tg"
import { format, startOfMonth, endOfMonth } from "date-fns"

const { close } = useWebApp()
const { showConfirm } = useWebAppPopup()
const { notificationOccurred } = useWebAppHapticFeedback()

const runtimeConfig = useRuntimeConfig()

const selectedMonth = ref<Date>(new Date())
const minDate = computed((): Date => startOfMonth(selectedMonth.value))
const maxDate = computed((): Date => endOfMonth(selectedMonth.value))

const minDateString = computed((): string =>
  format(minDate.value, "yyyy-MM-dd"),
)
const maxDateString = computed((): string =>
  format(maxDate.value, "yyyy-MM-dd"),
)

const { data: staffList } = await useStaffList()

const staffId = ref<number>()

const {
  data: shifts,
  status: shiftsStatus,
  refresh: refreshShifts,
} = useFetch("/shifts/v2/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: {
    staff_ids: staffId,
    limit: 1000,
    from_date: minDateString,
    to_date: maxDateString,
  },
  transform(data: { shifts: ShiftListItem[] }): ShiftListItem[] {
    return data.shifts
  },
  immediate: false,
  watch: [staffId],
})

const shiftDates = computed((): Date[] => {
  return shifts.value?.map((shift: ShiftListItem) => new Date(shift.date)) ?? []
})

const deleteShift = async (shiftId: number): Promise<void> => {
  const url = `/shifts/${shiftId}/`
  await $fetch(url, {
    method: "DELETE",
    baseURL: runtimeConfig.public.apiBaseUrl,
    ignoreResponseError: true,
  })
}

const createShift = async (staffId: number, date: string): Promise<void> => {
  const url = "/shifts/create/"
  await $fetch(url, {
    method: "POST",
    baseURL: runtimeConfig.public.apiBaseUrl,
    body: { staff_id: staffId, dates: [date] },
    ignoreResponseError: true,
  })
}

const getShiftDeleteConfirmMessage = (shift: ShiftListItem): string => {
  if (shift.confirmed_at) {
    return "Выход на смену уже подтвержден сотрудником. Вы уверены что хотите удалить смену?"
  }
  if (shift.started_at) {
    return "Сотрудник уже вышел на смену. Вы уверены что хотите удалить смену?"
  }
  if (shift.finished_at) {
    return "Сотрудник уже завершил смену. Вы уверены что хотите удалить смену?"
  }
  return "Вы уверены что хотите удалить смену?"
}

const onUpdate = async (updatedDates: Date[]): Promise<void> => {
  const datesToRemove = shiftDates.value.filter(
    (date) => !updatedDates.includes(date),
  )
  if (datesToRemove.length === 0) return
  const dateToRemove = datesToRemove[0]

  const shift = shifts.value?.find(
    (shift) => shift.date === format(dateToRemove, "yyyy-MM-dd"),
  )

  if (!shift) return

  const confirmMessage = getShiftDeleteConfirmMessage(shift)

  showConfirm?.(confirmMessage, async (ok: boolean): Promise<void> => {
    if (!ok) {
      await refreshShifts()
    } else {
      await deleteShift(shift.id)
      await refreshShifts()
      notificationOccurred("success")
    }
  })
}

const onDateSelect = async (value: Date): Promise<void> => {
  showConfirm?.(
    `Вы уверены что хотите добавить смену на дату ${format(
      value,
      "yyyy-MM-dd",
    )}?`,
    async (ok: boolean): Promise<void> => {
      if (!ok) {
        await refreshShifts()
      } else {
        await createShift(staffId.value!, format(value, "yyyy-MM-dd"))
        await refreshShifts()
        notificationOccurred("success")
      }
    },
  )
}
</script>
