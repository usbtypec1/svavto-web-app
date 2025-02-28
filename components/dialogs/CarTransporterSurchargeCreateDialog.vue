<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Доплатить сотруднику"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <CarTransporterSurchargeCreateForm @submit="onSubmitForm" :shifts />
  </Dialog>
</template>

<script setup lang="ts">
import CarTransporterSurchargeCreateForm from "../forms/CarTransporterSurchargeCreateForm.vue"
import type { CarTransporterSurchargeCreateEvent } from "~/types/surcharges"
import type { ShiftListItem } from "~/types/shifts"

const emit = defineEmits<{
  createCarTransporterSurcharge: [values: CarTransporterSurchargeCreateEvent]
}>()

defineProps<{
  shifts: ShiftListItem[]
}>()

const isVisible = defineModel<boolean>("visible", { default: false })

const onSubmitForm = (values: CarTransporterSurchargeCreateEvent): void => {
  emit("createCarTransporterSurcharge", values)
}
</script>
