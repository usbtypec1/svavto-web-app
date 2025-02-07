<template>
  <div class="flex flex-col gap-y-2">
    <p class="font-semibold">
      Список сотрудников которые поставили смену на выбранную дату
    </p>
    <Listbox
      v-model="selectedStaffList"
      :options="staffList"
      checkmark
      multiple
      option-label="full_name"
      empty-message="Нет запланированных на эту дату смен"
      filter
      :filter-fields="['full_name']"
      filter-placeholder="Поиск сотрудника"
      empty-filter-message="Нет сотрудников по запросу"
    />
  </div>
</template>

<script setup lang="ts">
import type { StaffIdAndName } from "~/types/staff"

const selectedStaffList = defineModel<StaffIdAndName[]>()

defineProps<{
  staffList: StaffIdAndName[]
}>()
</script>
