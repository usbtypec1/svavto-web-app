<template>
  <div>
		<Title>Выберите смену конкретного сотрудника</Title>
		<h1 class="text-lg font-semibold mb-2">Выберите смену сотрудника</h1>
    <Listbox
      v-model="selectedShiftId"
      :options="shifts ?? []"
      option-value="id"
      :option-label="shift => stringDateToDDMMYYYY(shift.date)"
			empty-message="Смены не найдены"
      checkmark
    />
    <MainButton
      @click="onSubmit"
      text="Подтвердить"
      :visible="selectedShiftId !== null"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp } from "vue-tg"
import type { Shift } from "~/types/shifts"

const { sendData } = useWebApp()

const route = useRoute()

const staffId = Number(route.params.staffId as string)

const runtimeConfig = useRuntimeConfig()

const url = `/shifts/staff/${staffId}/`
const { data: shifts, status } = useFetch(url, {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform(data: { shifts: Shift[] }): Shift[] {
    return data.shifts
  },
})

const selectedShiftId = ref<number | null>(null)

const serializedData = computed((): string =>
  JSON.stringify({
    staff_id: staffId,
    shift_id: selectedShiftId.value,
  }),
)

const onSubmit = (): void => {
  sendData?.(serializedData.value)
}
</script>
