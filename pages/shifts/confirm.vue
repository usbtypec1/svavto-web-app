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
          :disabled="specificRequest"
          @click="onSendToAllPerformers"
        />
        <Button class="grow" label="Нет" severity="danger" @click="close" :disabled="specificRequest"/>
      </div>
      <ToggleButton
        v-model="specificRequest"
        onLabel="Точечный запрос"
        offLabel="Точечный запрос"
      />
    </div>

    <BlockUI v-if="specificRequest" :blocked="status === 'pending'">
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
            @click="onSendToSpecificPerformers"
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
import { useWebApp } from 'vue-tg'

const toast = useToast()
const confirm = useConfirm()

const sendToAllPerformers = (): void => {
  toast.add({
    severity: 'success',
    summary: 'Запрос отправлен',
    detail: 'Запрос на подтверждение выхода на смену отправлен всем сотрудникам',
    life: 3000,
  })
}

const onSendToAllPerformers = (): void => {
  confirm.require({
    header: 'Отправить запрос?',
    message: 'Вы уверены что хотите отправить запрос всем сотрудникам на выбранную дату?',
    accept: sendToAllPerformers,
    rejectProps: {
      severity: 'secondary',
    },
  })
}

const sendToSpecificPerformers = (): void => {
  toast.add({
    severity: 'success',
    summary: 'Запрос отправлен',
    detail: 'Запрос на подтверждение выхода на смену отправлен выбранным сотрудникам',
    life: 3000,
  })
}

const onSendToSpecificPerformers = (): void => {
  confirm.require({
    header: 'Отправить запрос?',
    message: 'Вы уверены что хотите отправить запрос выбранным сотрудникам на выбранную дату?',
    accept: sendToSpecificPerformers,
    rejectProps: {
      severity: 'secondary',
    },
  })
}

const specificRequest = ref<boolean>(false)

const { close } = useWebApp()

interface Performer {
  id: number
  full_name: string
}

interface Shift {
  id: number
  performer: Performer
}


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
  if (date.value && specificRequest.value) {
    await execute()
  }
})

watch(specificRequest, () => {
  if (specificRequest.value) {
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
