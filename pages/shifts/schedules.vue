<template>
  <div>
    <div class="flex flex-col font-semibold gap-y-4">
      <h3 class="text-xl">Редактирование графика смен</h3>
      <div class="flex flex-col gap-2">
        <label for="staff">Сотрудник</label>
        <ProgressSpinner v-if="staffListStatus === 'loading'"/>
        <Select
          v-else-if="staffListStatus === 'success'"
          v-model="staff"
          :options="staffList!"
          option-label="full_name"
          input-id="staff"
          filter
          filter-placeholder="Поиск по ФИО, ID"
          :filter-fields="['full_name', 'id']"
          empty-selection-message="Выберите сотрудника"
          empty-message="Нет доступных сотрудников"
        />
      </div>
      <div
        v-if="staff"
        class="flex flex-col gap-2"
      >
        <p>График смен</p>
        <DatePicker
          :model-value="dates"
          @update:model-value="onUpdate"
          @date-select="onDateSelect"
          selection-mode="multiple"
          inline
          :disabled="isDisabled && shiftsStatus === 'success'"
        />
        <template v-if="shiftsStatus === 'error'">
          <Message
            severity="error"
            icon="pi pi-exclamation-triangle"
          >
            Не удалось загрузить график смен сотрудника
          </Message>
          <Button
            label="Загрузить еще раз"
            @click="refreshShifts"
            icon="pi pi-refresh"
            outlined
          />
        </template>
      </div>
    </div>
    <MainButton
      text="Готово"
      @click="close"
    />
  </div>
</template>

<script setup lang="ts">
import type { Staff } from '~/types/staff'
import type { Shift } from '~/types/shifts'
import { MainButton, useWebApp, useWebAppHapticFeedback, useWebAppPopup } from 'vue-tg'

const { close } = useWebApp()
const { showConfirm } = useWebAppPopup()
const { impactOccurred } = useWebAppHapticFeedback()

const runtimeConfig = useRuntimeConfig()

const { data: staffList, status: staffListStatus } = await useFetch('/staff/', {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform(data: { staff: Staff[] }) {
    return data.staff
  },
  deep: false,
})

const isDisabled = ref<boolean>(false)

const staff = ref<Staff>()

const shiftsUrl = computed((): string => `/shifts/staff/${staff.value?.id}/`)

const { data: shifts, status: shiftsStatus, refresh: refreshShifts } = await useFetch(shiftsUrl, {
  immediate: false,
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform(data: { shifts: Shift[] }) {
    return data.shifts
  },
  watch: [staff],
})


const dates = computed((): Date[] => {
    if (!shifts.value) return []
    return shifts.value.map((shift) => new Date(shift.date))
  },
)

const deleteShift = async (shiftId: number): Promise<void> => {
  const url = `/shifts/${shiftId}/`
  await $fetch(url, {
    method: 'DELETE',
    baseURL: runtimeConfig.public.apiBaseUrl,
    ignoreResponseError: true,
  })
}

const createShift = async (staffId: number, date: string): Promise<void> => {
  const url = '/shifts/create/'
  await $fetch(url, {
    method: 'POST',
    baseURL: runtimeConfig.public.apiBaseUrl,
    body: { staff_id: staffId, dates: [date] },
    ignoreResponseError: true,
  })
}

const dateToYYYYMMDDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const getShiftDeleteConfirmMessage = (shift: Shift): string => {
  if (shift.confirmed_at) {
    return 'Выход на смену уже подтвержден сотрудником. Вы уверены что хотите удалить смену?'
  }
  if (shift.started_at) {
    return 'Сотрудник уже вышел на смену. Вы уверены что хотите удалить смену?'
  }
  if (shift.finished_at) {
    return 'Сотрудник уже завершил смену. Вы уверены что хотите удалить смену?'
  }
  return 'Вы уверены что хотите удалить смену?'
}

const onUpdate = async (updatedDates: Date[]): Promise<void> => {
  const datesToRemove = dates.value.filter(date => !updatedDates.includes(date))
  if (datesToRemove.length === 0) return
  const dateToRemove = datesToRemove[0]

  const shift = shifts.value!.find((shift: Shift): boolean => shift.date === dateToYYYYMMDDD(dateToRemove))

  if (!shift) return

  const confirmMessage = getShiftDeleteConfirmMessage(shift)

  showConfirm?.(confirmMessage, async (ok: boolean): Promise<void> => {
    if (!ok) {
      await refreshShifts()
    } else {
      isDisabled.value = true
      try {
        await deleteShift(shift.id)
        await refreshShifts()
        impactOccurred?.('light')
      } finally {
        isDisabled.value = false
      }
    }
  })
}


const onDateSelect = async (value: Date): Promise<void> => {
  showConfirm?.(
    `Вы уверены что хотите добавить смену на дату ${dateToYYYYMMDDD(value)}?`,
    async (ok: boolean): Promise<void> => {
      if (!ok) {
        await refreshShifts()
      } else {
        isDisabled.value = true
        try {
          await createShift(staff.value!.id, dateToYYYYMMDDD(value))
          await refreshShifts()
          impactOccurred?.('light')
        } finally {
          isDisabled.value = false
        }
      }
    },
  )
}
</script>
