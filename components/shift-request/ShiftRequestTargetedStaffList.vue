<template>
  <div class="flex flex-col gap-y-2">
    <p class="font-semibold">
      Список сотрудников для точечной отправки запроса
    </p>
    <Listbox
      v-model="selectedStaffList"
      :options="staffList"
      checkmark
      multiple
      option-label="full_name"
      empty-message="Нет сотрудников"
      filter
      :filter-fields="['full_name']"
      filter-placeholder="Поиск сотрудника"
      empty-filter-message="Нет сотрудников по запросу"
    />
  </div>
</template>

<script setup lang="ts">
import type { StaffIdAndName } from "~/types/staff"

const selectedStaffList = defineModel<StaffIdAndName[]>("selectedStaffList")

defineProps<{
  staffList: StaffIdAndName[],
  staffIdsWithShiftForDate: number[],
}>()
</script>
