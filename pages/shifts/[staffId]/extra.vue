<template>
  <div>
    <p class="text-center font-semibold text-xl mb-3">
      Выберите дату для выхода на доп.смену
    </p>
    <DatePicker
      class="w-full"
      v-model="date"
      inline
      :min-date="minDate"
      :max-date="maxDate"
      :show-other-months="false"
      :disabled-dates="shiftDates!"
    />
    <MainButton
      @click="onSubmit"
      :visible="date !== undefined"
      text="Подтвердить"
    />
  </div>
</template>

<script setup lang="ts">
import {
  MainButton,
  useWebApp,
  useWebAppPopup,
  useWebAppHapticFeedback,
} from "vue-tg"
import { lastDayOfMonth, format } from "date-fns"
import type { ShiftListItem } from "~/types/shifts"

const { sendData } = useWebApp()
const { showConfirm } = useWebAppPopup()
const { notificationOccurred } = useWebAppHapticFeedback()

const date = ref<Date>()

const minDate = new Date()
const maxDate = lastDayOfMonth(new Date())

const route = useRoute()
const staffId = Number(route.params.staffId as string)

console.log(staffId)

const runtimeConfig = useRuntimeConfig()
const { data: shiftDates } = await useFetch("/shifts/v2/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: {
    staff_ids: staffId,
    types: ["extra", "regular"],
    from_date: format(minDate, "yyyy-MM-dd"),
    to_date: format(maxDate, "yyyy-MM-dd"),
  },
  transform(data: { shifts: ShiftListItem[] }): Date[] {
    return data.shifts.map(({ date }) => new Date(date))
  },
})

const ISODate = useDateFormat(date, "YYYY-MM-DD")

const onSubmit = (): void => {
  showConfirm?.(
    `Вы уверены что хотите записаться на доп.смену на дату ${format(
      date.value!,
      "dd.MM.yyyy",
    )}?`,
    (ok: boolean) => {
      if (!ok) return
      notificationOccurred?.("success")
      sendData?.(format(date.value!, "yyyy-MM-dd"))
    },
  )
}
</script>
