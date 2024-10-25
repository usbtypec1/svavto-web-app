<template>
  <div>
    <form class="flex flex-col gap-y-4" @submit.prevent>
      <h3 class="text-center font-semibold text-2xl">Записаться на смены</h3>
      <DatePicker
        :disabled="isFormSent"
        v-model="dates"
        selection-mode="multiple"
        inline
        :min-date="new Date()"
        show-button-bar
      />
      <p v-if="datesError" class="font-semibold">{{ datesError }}</p>
      <Button :disabled="isFormSent" v-if="dates.length" @click="onClearDates" label="Очистить" outlined/>
      <Button
        v-if="dates.length"
        @click="onShowSubmitDialog"
        type="submit"
        label="Подтвердить"
        raised
        :disabled="isFormSent"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
interface CalendarDate {
  day: number
  month: number
  year: number
  today: boolean
}

const isPreviousDate = (date: CalendarDate): boolean => {
  if (date.today) return false

  const currentDate = new Date()
  const selectedDate = new Date(date.year, date.month, date.day)
  return selectedDate.getTime() < currentDate.getTime()
}

const dates = ref<string[]>([])

const toast = useToast()
const confirm = useConfirm()

const isFormSent = ref<boolean>(false)

const submit = (): void => {
  isFormSent.value = true
  toast.add({
    severity: 'success',
    summary: 'Успешно',
    detail: 'Ваш график отправлен',
    life: 3000,
  })
}

const onShowSubmitDialog = (): void => {
  confirm.require({
    header: 'Запись на смены',
    message: 'Вы уверены, что хотите записаться на выбранные даты?',
    accept: submit,
    acceptLabel: 'Подтвердить',
    rejectProps: {
      label: 'Отменить',
      severity: 'secondary',
    },
  })
}

const onClearDates = (): void => {
  dates.value = []
}

const datesError = computed((): string | null => {
  if (!dates.value.length) {
    return 'Выберите одну или несколько дат'
  }
  return null
})
</script>
