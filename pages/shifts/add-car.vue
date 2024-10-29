<template>
  <div>
    <CarAddForm
      v-model:is-additional-services-included="isAdditionalServicesIncluded"
    />
    <template v-if="isAdditionalServicesIncluded">
      <AdditionalServicesForm/>
      <div class="flex justify-between gap-x-3 my-5">
        <Button
          @click="onConfirmAll"
          label="Подтвердить все"
          icon="pi pi-check"
          class="w-full"
        />
        <Button
          @click="isAdditionalServicesIncluded = false"
          class="w-full"
          severity="warn"
          icon="pi pi-times"
          label="Очистить доп.услуги"
        />
      </div>
    </template>
  </div>

</template>

<script setup lang="ts">
import CarAddForm from '~/components/forms/CarAddForm.vue'
import AdditionalServicesForm from '~/components/forms/AdditionalServicesForm.vue'
import { useWebAppPopup, useWebApp } from 'vue-tg'

const { sendData } = useWebApp()
const { showConfirm, showAlert } = useWebAppPopup()

const isAdditionalServicesIncluded = ref<boolean>(false)

const onConfirmAll = () => {
  showConfirm?.('Записать автомобиль в список выполненных?', (ok: boolean) => {
    if (ok) {
      showAlert?.('Данные по автомобилю {ГОС НОМЕР} записаны')
    } else {
      showConfirm?.('Вы уверены? Это действие удалит все ранее внесенные данные по автомобилю {НОМЕР}', (ok) => {
        if (ok) {
          showAlert?.('Удалено')
        }
      })
    }
  })
}
</script>
