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
