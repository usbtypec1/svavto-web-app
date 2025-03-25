<template>
  <Message severity="success">
    <p><i class="pi pi-receipt" /> Причина: {{ surcharge.reason }}</p>
    <p class="flex items-center gap-x-1">
      <i class="pi pi-money-bill" /> Цена: {{ surcharge.amount }}₽
    </p>
    <p class="flex items-center gap-x-1">
      <i class="pi pi-calendar" />Дата смены: {{ format(surcharge.date, 'dd.MM.yyyy') }}
    </p>
    <p class="flex items-center gap-x-1">
      <i class="pi pi-calendar-clock" /> Дата выдачи доплаты:
      {{ format(surcharge.created_at, 'dd.MM.yyyy') }}
    </p>
  </Message>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import type { CarTransporterSurcharge } from "~/types/surcharges"

const props = defineProps<{
  surcharge: CarTransporterSurcharge
}>()

const formattedCreateAt = useDateFormat(
  props.surcharge.created_at,
  "DD.MM.YYYY HH:mm",
)

const formattedShiftDate = useDateFormat(
  props.surcharge.date,
  "DD.MM.YYYY",
)
</script>
