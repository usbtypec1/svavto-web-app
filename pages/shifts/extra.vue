<template>
  <div>
    <p class="text-center font-semibold text-xl mb-3">Выберите дату для выхода на доп.смену</p>
    <DatePicker
      class="w-full"
      v-model="date"
      inline
      :min-date="new Date()"
      :showOtherMonths="false"
    />
    <MainButton
      @click="onSubmit"
      :visible="date !== undefined"
      text="Подтвердить"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp, useWebAppPopup, useWebAppHapticFeedback } from 'vue-tg'

const { sendData } = useWebApp()
const { showConfirm } = useWebAppPopup()
const { notificationOccurred } = useWebAppHapticFeedback()

const date = ref<Date>()

const humanizedDate = useDateFormat(date, 'DD.MM.YYYY')
const ISODate = useDateFormat(date, 'YYYY-MM-DD')

const onSubmit = (): void => {
  showConfirm?.(
    `Вы уверены что хотите записаться на доп.смену на дату ${humanizedDate.value!}?`,
    (ok: boolean) => {
      if (!ok) return
      notificationOccurred?.('success')
      sendData?.(ISODate.value!)
    },
  )
}
</script>
