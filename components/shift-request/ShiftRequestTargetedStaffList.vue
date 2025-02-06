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
