<template>
  <div>
    <CarAddForm
      v-model:car-to-wash="carToWash"
      v-model:is-additional-services-included="isAdditionalServicesIncluded"
      @confirm="onConfirmAll"
    />
    <template v-if="isAdditionalServicesIncluded">
      <AdditionalServicesForm v-model="additionalServices"/>
      <Button
        v-if="additionalServices.length > 0"
        @click="isAdditionalServicesIncluded = false"
        class="w-full my-5"
        severity="warn"
        icon="pi pi-times"
        label="Очистить все доп.услуги"
      />
      <MainButton
        text="Подтвердить все услуги"
        @click="onConfirmAll"
      />
    </template>
  </div>

</template>

<script setup lang="ts">
import CarAddForm from '~/components/forms/CarAddForm.vue'
import AdditionalServicesForm from '~/components/forms/AdditionalServicesForm.vue'
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'
import type { CarToWashDraft } from '~/types/cars'

const { sendData } = useWebApp()
const { showConfirm, showAlert } = useWebAppPopup()

const carToWash = ref<CarToWashDraft>({})
const isAdditionalServicesIncluded = ref<boolean>(false)

const additionalServices = ref([])

const serializedData = computed((): string => {
  return JSON.stringify({
    number: carToWash.value?.number,
    class_type: carToWash.value?.classType,
    wash_type: carToWash.value?.washType,
    windshield_washer_refilled_bottle_percentage: carToWash.value?.windshieldWasherRefilledBottlePercentage ?? 0,
    additional_services: additionalServices.value,
  })
})

const onConfirmAction = (ok: boolean) => {
  if (!ok) return
  showAlert?.(`Данные по автомобилю ${carToWash.value.number} записаны`)
  sendData?.(serializedData.value)
}

const onConfirmAll = () => {
  showConfirm?.('Записать автомобиль в список выполненных?', onConfirmAction)
}
</script>
