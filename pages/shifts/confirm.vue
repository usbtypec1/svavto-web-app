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

    <div v-if="status === 'success' && specificRequest" class="my-3 flex flex-col justify-between gap-y-2">
      <p>Выберите конкретных сотрудников кому отправить запрос</p>
      <Listbox
        v-model="selectedPerformerIds"
        :options="data.shifts"
        multiple
        optionLabel="performer.full_name"
        option-value="performer.id"
        checkmark
      />
      <Button
        :disabled="selectedPerformerIds.length === 0"
        label="Отправить запрос"
        @click="onSendToSpecificPerformers"
      />
    </div>
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

interface PerformerShifts {
  shifts: Shift[]
  date: string
}

const selectedPerformerIds = ref<number[]>()

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const date = ref<Date>(new Date())

const url = computed((): string => {
  if (date.value) {
    return `/api/shifts/${formatDate(date.value)}`
  }
})

const { data, execute, status } = useFetch<PerformerShifts>(url)

watch(date, async () => {
  selectedPerformerIds.value = []
  if (date.value) {
    await execute()
  }
})

watch(specificRequest, () => {
  if (specificRequest.value) {
    selectedPerformerIds.value = []
  }
})

const datesError = computed((): string | null => {
  if (!date.value) {
    return 'Выберите дату'
  }
  return null
})
</script>
