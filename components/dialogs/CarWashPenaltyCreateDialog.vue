<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Оштрафовать мойку"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <CarWashPenaltyCreateForm @submit="onSubmitForm" />
  </Dialog>
</template>

<script setup lang="ts">
import CarWashPenaltyCreateForm from "~/components/forms/CarWashPenaltyCreateForm.vue"
import type { CarWashPenaltyCreateEvent } from "~/types/penalties"

const emit = defineEmits<{
  createCarWashPenalty: [values: any]
}>()

const isVisible = defineModel<boolean>("visible", { default: false })

const onSubmitForm = (values: CarWashPenaltyCreateEvent): void => {
  emit("createCarWashPenalty", values)
  isVisible.value = false
}
</script>
