<template>
  <div>
    <form class="flex flex-col gap-y-4" @submit.prevent>
      <h3 class="text-center font-semibold text-2xl">Записаться на смены</h3>
      <DatePicker
        v-model="dates"
        selection-mode="multiple"
        inline
        :min-date="new Date()"
        show-button-bar
      />
      <p v-if="datesError" class="font-semibold">{{ datesError }}</p>
      <Button
        v-if="dates.length"
        @click="onClearDates"
        label="Очистить"
        icon="pi pi-trash"
        outlined
      />
    </form>
    <MainButton
      @click="onSubmit"
      type="submit"
      label="Подтвердить"
      raised
      :visible="dates.length > 0"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'

const { sendData } = useWebApp()
const { showConfirm } = useWebAppPopup()

const dates = ref<string[]>([])

const onConfirm = (ok: boolean): void => {
  if (ok) {
    sendData?.(JSON.stringify({ event: 'shift_apply', dates }))
  }
}

const onSubmit = () => {
  showConfirm?.(
    'Вы уверены, что хотите записаться на выбранные даты?',
    onConfirm,
  )
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
