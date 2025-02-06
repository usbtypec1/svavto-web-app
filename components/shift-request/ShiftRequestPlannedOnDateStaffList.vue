<template>
  <div class="flex flex-col gap-y-2">
    <p class="font-semibold">
      Список сотрудников которые поставили смену на выбранную дату
    </p>
    <Listbox
      :options="selectedStaffList"
      option-label="staff.full_name"
      option-value="staff.id"
      empty-message="Нет запланированных на эту дату смен"
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
