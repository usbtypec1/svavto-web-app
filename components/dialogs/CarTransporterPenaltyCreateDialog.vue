<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Оштрафовать сотрудника"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <CarTransporterPenaltyCreateForm @submit="onSubmitForm" :shifts />
  </Dialog>
</template>

<script setup lang="ts">
import CarTransporterPenaltyCreateForm from "../forms/CarTransporterPenaltyCreateForm.vue"
import type { CarWashPenaltyCreateEvent } from "~/types/penalties"
import type { ShiftListItem } from "~/types/shifts"

const emit = defineEmits<{
  createCarTransporterPenalty: [values: any]
}>()

defineProps<{
  shifts: ShiftListItem[]
}>()

const isVisible = defineModel<boolean>("visible", { default: false })

const onSubmitForm = (values: CarWashPenaltyCreateEvent): void => {
  emit("createCarTransporterPenalty", values)
  isVisible.value = false
}
</script>
