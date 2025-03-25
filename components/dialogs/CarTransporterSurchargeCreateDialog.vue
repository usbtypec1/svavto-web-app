<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Доплатить сотруднику"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <CarTransporterSurchargeCreateForm @submit="onSubmitForm" :staff-id />
  </Dialog>
</template>

<script setup lang="ts">
import type { CarTransporterSurchargeCreateEvent } from "~/types/surcharges"

const emit = defineEmits<{
  createCarTransporterSurcharge: [values: CarTransporterSurchargeCreateEvent]
}>()

defineProps<{
  staffId: number
}>()

const isVisible = defineModel<boolean>("visible", { default: false })

const onSubmitForm = (values: CarTransporterSurchargeCreateEvent): void => {
  emit("createCarTransporterSurcharge", values)
}
</script>
