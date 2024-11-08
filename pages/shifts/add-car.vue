<template>
  <div>
    <CarAddForm
      :is-additional-services-included="isAdditionalServicesIncluded"
      @submit-without-additional-services="onAddCarWithoutAdditionalServices"
      @submit-with-additional-services="onAddCarWithAdditionalServices"
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
      />
    </template>
  </div>

</template>

<script setup lang="ts">
import CarAddForm from '~/components/forms/CarAddForm.vue'
import AdditionalServicesForm from '~/components/forms/AdditionalServicesForm.vue'
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'
import type { CarToWash } from '~/types/cars'

const { sendData } = useWebApp()
const { showConfirm, showAlert } = useWebAppPopup()

const isAdditionalServicesIncluded = ref<boolean>(false)

const additionalServices = ref([])

const onAddCarWithoutAdditionalServices = (car: CarToWash): void => {
  showConfirm?.(`Записать автомобиль ${car.number} в список выполненных?`, (ok: boolean): void => {
    if (!ok) return
    showAlert?.(`Данные по автомобилю ${car.number} записаны`)
    sendData?.(JSON.stringify({
      number: car.number,
      class_type: car.classType,
      wash_type: car.washType,
      windshield_washer_refilled_bottle_percentage: car.windshieldWasherRefilledBottlePercentage,
      additionalServices: [],
    }))
  })
}

const onAddCarWithAdditionalServices = (car: CarToWash): void => {
  console.log(car)
  isAdditionalServicesIncluded.value = true
}
</script>
