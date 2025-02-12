<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Доплатить мойке"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <CarWashSurchargeCreateForm @submit="onSubmitForm" />
  </Dialog>
</template>

<script setup lang="ts">
import type { CarWashSurchargeCreateEvent } from "~/types/surcharges"
import CarWashSurchargeCreateForm from "../forms/CarWashSurchargeCreateForm.vue"

const emit = defineEmits<{
  createCarWashSurcharge: [values: any]
}>()

const isVisible = defineModel<boolean>("visible", { default: false })

const onSubmitForm = (values: CarWashSurchargeCreateEvent): void => {
  emit("createCarWashSurcharge", values)
  isVisible.value = false
}
</script>
