<template>
  <Card>
    <template #content>
      <div>
        <span class="font-semibold">Гос.номер: </span>
        <span>{{ transferredCar.number }}</span>
      </div>
      <div>
        <span class="font-semibold">Класс автомобиля: </span>
        <span>{{ classTypeValueToLabel[transferredCar.class_type] }}</span>
      </div>
      <div>
        <span class="font-semibold">Вид мойки: </span>
        <span>{{ washTypeValueToLabel[transferredCar.wash_type] }}</span>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { classTypeValueToLabel, washTypeValueToLabel } from '~/utils/car-wash-services'
import type { TransferredCarDetail } from '~/types/cars'

defineProps<{
  transferredCar: TransferredCarDetail,
}>()
</script>
