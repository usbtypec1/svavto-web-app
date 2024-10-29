<template>
  <div class="flex flex-col gap-y-3 mb-10">
    <p class="font-semibold text-md">Выберите месяцы которые будут отображаться у сотрудника</p>
    <div v-auto-animate>
      <div
        v-for="(availableDate, index) in staffAvailableDates"
        :key="availableDate.id"
        class="flex flex-col gap-y-1"
      >
        <label
          class="font-semibold"
          :for="availableDate.id"
        >
          Месяц №{{ index + 1 }}
        </label>
        <div class="flex justify-between gap-x-3">
          <DatePicker
            view="month"
            v-model="availableDate.value"
            dateFormat="MM - yy год"
            class="flex-1"
            :input-id="availableDate.id"
          />
          <Button
            @click="onRemoveStaffAvailableDate(availableDate.id)"
            icon="pi pi-trash"
            severity="danger"
            text
          />
        </div>
        <Divider/>
      </div>
    </div>
    <Button label="Добавить месяц" @click="onAddStaffAvailableDate"/>
    <MainButton @click="onSaveStaffAvailableDates" text="Сохранить"/>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuid4 } from 'uuid'
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'

const { showAlert } = useWebAppPopup()

const onRemoveStaffAvailableDate = (id: string): void => {
  staffAvailableDates.value = staffAvailableDates.value.filter(availableDate => availableDate.id !== id)
}

const onAddStaffAvailableDate = (): void => {
  staffAvailableDates.value.push({ id: uuid4() })
}

interface AvailableDate {
  id: string,
  value?: Date
}

interface MonthAndYear {
  month: number
  year: number
}


const { sendData } = useWebApp()

const staffAvailableDates = ref<AvailableDate[]>([])

const uniqueDates = computed<Date[]>(() => {
  const dates = staffAvailableDates.value
    .filter(date => date.value !== undefined)
    .map(date => date.value!)

  return Array.from(new Set(dates))
})

const dateToMonthAndYear = (date: Date): MonthAndYear => {
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }
}

const uniqueDatesSerialized = computed<string>(() => {
  return JSON.stringify({
    staffId,
    dates: uniqueDates.value.map(dateToMonthAndYear),
  })
})

const onSaveStaffAvailableDates = (): void => {
  if (uniqueDates.value.length > 0) {
    sendData?.(uniqueDatesSerialized.value)
  } else {
    showAlert?.('Выберите хотя бы один месяц')
  }
}

const route = useRoute()

const staffId = Number(route.params.staffId as string)

const staffStore = useStaffStore()
let staff = staffStore.findById(staffId)
if (staff === null) {
  staff = await staffStore.fetchById(staffId)
}
</script>
