<template>
  <div class="flex flex-col gap-y-4">
    <h3 class="text-xl font-semibold">Тестовый доступ</h3>
    <div class="flex flex-col gap-y-2">
      <p class="font-semibold">Дата смены</p>
      <DatePicker
        v-model="date"
        inline
        date-format="dd/mm/yy"
        :min-date="new Date()"
        fluid
      />
    </div>
    <div class="flex flex-col gap-y-2">
      <p class="font-semibold">Сотрудники</p>
      <Listbox
        v-if="status === 'success'"
        v-model="selectedStaffIds"
        :options="staffList!"
        multiple
        filter
        filter-placeholder="Поиск по ФИО"
        filterMessage="Найдено {0} сотрудников"
        emptyFilterMessage="Не найдено сотрудников"
        checkmark
        option-label="full_name"
        option-value="id"
        class="w-full"
      />
    </div>
    <MainButton
      :text="buttonText"
      :visible="selectedStaffIds.length > 0"
      @click="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp, useWebAppHapticFeedback, useWebAppPopup } from 'vue-tg'
import type { Staff } from '~/types/staff'

const date = ref<Date>(new Date())

const { sendData } = useWebApp()

const selectedStaffIds = ref<number[]>([])

const runtimeConfig = useRuntimeConfig()

const { data: staffList, status } = await useFetch('/staff/', {
  query: { order_by: '-created_at' },
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform(data: { staff: Staff[] }) {
    return data.staff
  },
  deep: false,
})

const buttonText = computed((): string => `Отправить запрос ${selectedStaffIds.value.length} сотрудникам`)

const onSubmit = (): void => {
  sendData?.(JSON.stringify(selectedStaffIds.value))
}
</script>
