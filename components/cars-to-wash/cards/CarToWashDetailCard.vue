<template>
  <Card>
    <template #content>
      <div>
        <span class="font-semibold">Гос.номер: </span>
        <span>{{ carToWash.number }}</span>
      </div>
      <div>
        <span class="font-semibold">Класс автомобиля: </span>
        <span>{{ classTypeValueToLabel[carToWash.class_type] }}</span>
      </div>
      <div>
        <span class="font-semibold">Вид мойки: </span>
        <span>{{ washTypeValueToLabel[carToWash.wash_type] }}</span>
      </div>
      <div>
        <template
          v-if="carToWash.windshield_washer_refilled_bottle_percentage === 0"
        >
          <span class="font-semibold">Незамерзающая жидкость: </span>
          <span>без долива/долита вода</span>
        </template>
        <template
          v-else
        >
          <span class="font-semibold">Незамерзающая жидкость: </span>
          <span>{{ carToWash.windshield_washer_refilled_bottle_percentage }}%</span>
        </template>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { classTypeValueToLabel, washTypeValueToLabel } from '~/utils/car-wash-services'
import type { CarToWashDetail } from '~/types/cars'

defineProps<{
  carToWash: CarToWashDetail,
}>()
</script>
