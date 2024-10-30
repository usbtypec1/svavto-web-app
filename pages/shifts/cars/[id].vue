<template>
  <div class="flex flex-col gap-y-3">
    <Fieldset legend="Данные о машине">
      <div class="flex flex-col gap-y-2">
        <div>
          <span class="font-semibold">Гос.номер: </span>
          <span>{{ car.number }}</span>
        </div>
        <div>
          <span class="font-semibold">Класс: </span>
          <span>{{ classType }}</span>
        </div>
        <div>
          <span class="font-semibold">Вид мойки: </span>
          <span>{{ washType }}</span>
        </div>
        <div>
          <span class="font-semibold">Долив стеклоомывателя: </span>
          <span>{{ windshieldWasherRefilledBottlePercentage }}</span>
        </div>
      </div>
    </Fieldset>
    <AdditionalServicesForm
      v-model="additionalServices"
    />
    <MainButton
      text="Сохранить"
      @click="onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import AdditionalServicesForm from '~/components/forms/AdditionalServicesForm.vue'
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'

const { showConfirm } = useWebAppPopup()
const { sendData } = useWebApp()

const route = useRoute()

const carId = Number(route.params.id as string)
const runtimeConfig = useRuntimeConfig()

const washType = computed((): string => {
  return {
    'planned': 'плановая',
    'urgent': 'срочная',
  }[car.value.wash_type]
})

const classType = computed((): string => {
  return {
    'comfort': 'комфорт',
    'business': 'бизнес',
    'van': 'фургон',
  }[car.value.class_type]
})

const windshieldWasherRefilledBottlePercentage = computed((): string => {
  const percentage = car.value.windshield_washer_refilled_bottle_percentage
  return percentage === 0 ? 'нет' : `${percentage}%`
})

const additionalServices = ref([])

const { data: car } = await useFetch(`${runtimeConfig.public.apiBaseUrl}/shifts/cars/${carId}/`)

const serializedData = computed((): string => {
  return JSON.stringify({
    additional_services: additionalServices.value,
  })
})

const onConfirm = (): void => {
  if (additionalServices.value.length === 0) {
    showConfirm?.(
      'Вы уверены? Вы не выбрали ни одну услугу и это действие удалит все ранее внесенные данные по автомобилю ${car.value.number}',
      (ok) => ok && sendData?.(serializedData.value),
    )
  } else {
    showConfirm?.(
      `Вы уверены? Это действие удалит все ранее внесенные данные по автомобилю ${car.value.number}`,
      (ok) => ok && sendData?.(serializedData.value),
    )
  }
}
</script>
