<template>
  <div class="flex flex-col gap-y-3">
    <h3 class="text-center font-semibold text-2xl">Сегодня в смене</h3>
    <div v-auto-animate>
      <div
        v-if="!onlySpecificStaff"
        class="flex flex-col gap-y-1"
      >
        <div class="flex flex-col gap-y-2">
          <label class="font-semibold">Дата на которую поставили смены</label>
          <DatePicker
            v-model="date"
            date-format="dd.mm.yy"
            :min-date="new Date()"
            fluid
            inline
          />
        </div>
        <ProgressSpinner v-if="staffListForSpecificDateStatus === 'pending'"/>
        <div
          v-else-if="staffListForSpecificDateStatus === 'success'"
          class="flex flex-col gap-y-2"
        >
          <p></p>
          <p class="font-semibold">Список сотрудников которые поставили смену на выбранную дату</p>
          <Listbox
            :options="shifts!"
            option-label="staff.full_name"
            option-value="shift_id"
            empty-message="Нет запланированных на эту дату смен"
          />
        </div>
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
      <div
        v-if="onlySpecificStaff"
      >
        <ProgressSpinner v-if="staffListStatus === 'pending'"/>
        <div
          v-else-if="staffListStatus === 'success'"
          class="flex flex-col gap-y-2"
        >
          <p class="font-semibold text-lg">Список сотрудников для точечной отправки запроса</p>
          <Listbox
            v-model="selectedStaffIds"
            :options="staffList!"
            checkmark
            multiple
            option-label="full_name"
            option-value="id"
            empty-message="Нет сотрудников"
          />
        </div>
        <Message
          v-else-if="staffListStatus"
          severity="error"
          icon="pi pi-exclamation-triangle"
        >
          Не удалось загрузить список сотрудников
        </Message>
      </div>
    </div>

    <MainButton
      @click="onConfirm"
      text="Подтвердить"
      :visible="isMainButtonVisible"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'
import type { Staff } from '~/types/staff'
import type { ShiftWithStaff } from '~/types/shifts'
import * as dayjs from 'dayjs'

const { close, sendData } = useWebApp()
const { showConfirm, showAlert } = useWebAppPopup()

const selectedStaffIds = ref<number[]>([])

const date = ref<Date>(new Date())

const humanizedDate = useDateFormat(date, 'DD.MM.YYYY')

const formattedDate = useDateFormat(date, 'YYYY-MM-DD')

const runtimeConfig = useRuntimeConfig()

const onlySpecificStaff = ref<boolean>(false)

watch(onlySpecificStaff, async () => {
  if (onlySpecificStaff.value) {
    await refreshStaffList()
  }
})

const {
  data: staffList,
  status: staffListStatus,
  refresh: refreshStaffList,
} = useFetch('/staff/', {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: {
    order_by: '-created_at',
  },
  transform(data: { staff: Staff[] }) {
    return data.staff
  },
  deep: false,
  immediate: false,
})

const {
  data: shifts,
  refresh: shiftsStatus,
  status: staffListForSpecificDateStatus,
} = useFetch('/shifts/specific-date/', {
  query: { date: formattedDate },
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { shifts: ShiftWithStaff[] }) => data.shifts,
})

watch(date, async () => {
  if (date.value) {
    await shiftsStatus()
  }
})

const isMainButtonVisible = computed((): boolean => {
  if (onlySpecificStaff.value) {
    return selectedStaffIds.value.length > 0
  }
  return !!date.value
})

const confirmationText = computed((): string => {
  if (onlySpecificStaff.value) {
    return 'Вы уверены что хотите отправить запрос выбранным сотрудникам?'
  }
  return `Отправить запрос на дату ${humanizedDate.value} всем сотрудникам?`
})

const shiftsForDateToSend = computed((): { date: string, staff_ids: number[] } => {
  if (onlySpecificStaff.value) {
    const today = dayjs(new Date()).format('YYYY-MM-DD')
    return {
      date: today,
      staff_ids: selectedStaffIds.value,
    }
  }
  return {
    date: formattedDate.value,
    staff_ids: staffList.value?.map((staff) => staff.id) ?? [],
  }
})

const serializedData = computed((): string => JSON.stringify(shiftsForDateToSend.value))

const onConfirm = (): void => {
  showConfirm?.(confirmationText.value, (ok: boolean) => {
    if (!ok) return
    sendData?.(serializedData.value)
  })
}
</script>
