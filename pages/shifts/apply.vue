<template>
  <div>
    <form class="flex flex-col gap-y-4" @submit.prevent>
      <h3 class="text-center font-semibold text-2xl">Записаться на смены</h3>
      <DatePicker
        v-model="dates"
        selection-mode="multiple"
        inline
        show-button-bar
        :showOtherMonths="false"
        :min-date="new Date()"
        :max-date="getLastDayOfMonth()"
      />
      <p v-if="datesError" class="font-semibold">{{ datesError }}</p>
    </form>
    <MainButton
      @click="onSubmit"
      type="submit"
      text="Подтвердить"
      raised
      :visible="dates.length > 0"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'

const { sendData } = useWebApp()
const { showConfirm } = useWebAppPopup()

const getLastDayOfMonth = (): Date => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth() + 1, 0)
}

const dates = ref<Date[]>([])

const dateToYYYYMMDDD = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month}-${day}`
}

const serializedDataToSend = computed((): string => JSON.stringify(dates.value.map(dateToYYYYMMDDD)))

const onSubmit = () => {
  showConfirm?.(
    'Вы уверены, что хотите записаться на выбранные даты?',
    (ok: boolean) => ok && sendData?.(serializedDataToSend.value),
  )
}

const datesError = computed((): string | null => {
  if (!dates.value.length) {
    return 'Выберите одну или несколько дат'
  }
  return null
})
</script>
