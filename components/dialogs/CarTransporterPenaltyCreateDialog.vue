<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Оштрафовать сотрудника"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <CarTransporterPenaltyCreateForm @submit="onSubmitForm" :staff-id />
  </Dialog>
</template>

<script setup lang="ts">
import type { CarTransporterPenaltyCreateEvent } from "~/types/penalties"

const emit = defineEmits<{
  createCarTransporterPenalty: [values: any]
}>()

defineProps<{
  staffId: number
}>()

const isVisible = defineModel<boolean>("visible", { default: false })

const onSubmitForm = (values: CarTransporterPenaltyCreateEvent): void => {
  emit("createCarTransporterPenalty", values)
}
</script>
