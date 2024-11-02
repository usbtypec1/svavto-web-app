<template>
  <div class="mb-6">
    <form class="flex flex-col gap-y-4" @submit.prevent>
      <h3 class="text-center font-semibold text-xl">Сегодня в смене</h3>
      <DatePicker
        v-model="date"
        inline
        date-format="dd/mm/yy"
        :min-date="new Date()"
      />
      <p v-if="datesError" class="font-semibold">{{ datesError }}</p>
    </form>
    <p class="font-semibold my-3">Отправить запрос на подтверждение выхода на смену?</p>
    <div class="flex flex-col gap-y-2">
      <div class="flex gap-x-2">
        <Button
          class="grow"
          label="Да"
          :disabled="isSpecificStaffMode"
          @click="onSendToAllStaff"
        />
        <Button class="grow" label="Нет" severity="danger" @click="close" :disabled="isSpecificStaffMode"/>
      </div>
      <ToggleButton
        v-model="isSpecificStaffMode"
        onLabel="Точечный запрос"
        offLabel="Точечный запрос"
      />
    </div>

    <BlockUI v-if="isSpecificStaffMode" :blocked="status === 'pending'">
      <div class="flex flex-col gap-y-2 my-3">
        <template v-if="status === 'success'">
          <p>Выберите сотрудников</p>
          <Listbox
            v-model="selectedShifts"
            :options="shiftConfirmations"
            multiple
            optionLabel="staff_full_name"
            checkmark
            emptyMessage="Нет доступных сотрудников на эту дату"
          />
          <Button
            :disabled="selectedShifts.length === 0"
            label="Отправить запрос"
            @click="onSendToSpecificStaff"
          />
        </template>
        <Message v-else-if="status === 'error'" severity="error" class="my-3">
          Произошла ошибка при загрузке списка сотрудников
        </Message>
      </div>
    </BlockUI>
  </div>
</template>

<script setup lang="ts">
import { useWebApp, useWebAppPopup } from 'vue-tg'

const { close, sendData } = useWebApp()
const { showConfirm } = useWebAppPopup()

const onSendToAllStaff = (): void => {
  showConfirm?.(
    'Вы уверены что хотите отправить запрос на подтверждение выхода на смену всем сотрудникам на выбранную дату?',
    (ok: boolean): void => {
      if (ok) {
        sendData?.(JSON.stringify(shiftConfirmations.value))
      }
    },
  )
}


const onSendToSpecificStaff = (): void => {
  showConfirm?.(
    'Вы уверены что хотите отправить запрос выбранным сотрудникам на выбранную дату?',
    (ok: boolean) => {
      if (ok) {
        sendData?.(JSON.stringify(selectedShifts.value))
      }
    },
  )
}

const isSpecificStaffMode = ref<boolean>(false)

const selectedShifts = ref<ShiftConfirmation[]>()

const date = ref<Date>(new Date())

const formattedDate = useDateFormat(date, 'YYYY-MM-DD')

const runtimeConfig = useRuntimeConfig()

interface ShiftConfirmation {
  shift_id: number
  staff_id: number
  staff_full_name: string
}

const { data: shiftConfirmations, execute, status } = useFetch<ShiftConfirmation[]>('/shifts/staff/', {
  query: { date: formattedDate },
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { staff_list: ShiftConfirmation[] }) => data.staff_list,
})

watch(date, async () => {
  selectedShifts.value = []
  if (date.value && isSpecificStaffMode.value) {
    await execute()
  }
})

watch(isSpecificStaffMode, () => {
  if (isSpecificStaffMode.value) {
    selectedShifts.value = []
  }
})

const datesError = computed((): string | null => {
  if (!date.value) {
    return 'Выберите дату'
  }
  return null
})
</script>
