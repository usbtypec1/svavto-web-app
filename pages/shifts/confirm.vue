<template>
  <div class="mb-6">
    <form class="flex flex-col gap-y-4" @submit.prevent>
      <h3 class="text-center font-semibold text-2xl">Сегодня в смене</h3>
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
            v-model="selectedStaffIds"
            :options="staffList"
            multiple
            optionLabel="staff_full_name"
            option-value="shift_id"
            checkmark
            emptyMessage="Нет доступных сотрудников на эту дату"
          />
          <Button
            :disabled="selectedStaffIds.length === 0"
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

const { close } = useWebApp()
const { showConfirm, showAlert } = useWebAppPopup()

const onSendToAllStaff = (): void => {
  showConfirm?.(
    'Вы уверены что хотите отправить запрос на подтверждение выхода на смену всем сотрудникам на выбранную дату?',
    (ok: boolean) => {
      if (ok) {
        showAlert?.('Запрос на подтверждение выхода на смену отправлен всем сотрудникам')
      }
    },
  )
}


const onSendToSpecificStaff = (): void => {
  showConfirm?.(
    'Вы уверены что хотите отправить запрос выбранным сотрудникам на выбранную дату?',
    (ok: boolean) => {
      if (ok) {
        showAlert?.('Запрос на подтверждение выхода на смену отправлен выбранным сотрудникам')
      }
    },
  )
}


const isSpecificStaffMode = ref<boolean>(false)

const selectedStaffIds = ref<number[]>()

const date = ref<Date>(new Date())

const formattedDate = useDateFormat(date, 'YYYY-MM-DD')

const runtimeConfig = useRuntimeConfig()

const url = `${runtimeConfig.public.apiBaseUrl}/shifts/staff/`

const { data, execute, status } = useFetch(url, {
  query: { date: formattedDate },
  immediate: false,
  watch: false,
})

const staffList = computed(() => {
  return data.value.staff_list
})

watch(date, async () => {
  selectedStaffIds.value = []
  if (date.value && isSpecificStaffMode.value) {
    await execute()
  }
})

watch(isSpecificStaffMode, () => {
  if (isSpecificStaffMode.value) {
    selectedStaffIds.value = []
  }
})

const datesError = computed((): string | null => {
  if (!date.value) {
    return 'Выберите дату'
  }
  return null
})
</script>
