<template>
  <Message severity="success">
    <p><i class="pi pi-receipt" /> Причина: {{ surcharge.reason }}</p>
    <p class="flex items-center gap-x-1">
      <i class="pi pi-money-bill" /> Цена: {{ surcharge.amount }}₽
    </p>
    <p class="flex items-center gap-x-1">
      <i class="pi pi-calendar" />Дата смены: {{ formattedShiftDate }}
    </p>
    <p class="flex items-center gap-x-1">
      <i class="pi pi-calendar-clock" /> Дата выдачи штрафа:
      {{ formattedCreateAt }}
    </p>
  </Message>
</template>

<script setup lang="ts">
import type { Surcharge } from "~/types/surcharges"

const props = defineProps<{
  surcharge: Surcharge
}>()

const formattedCreateAt = useDateFormat(
  props.surcharge.created_at,
  "DD.MM.YYYY HH:mm",
)

const formattedShiftDate = useDateFormat(
  props.surcharge.shift_date,
  "DD.MM.YYYY",
)
</script>
