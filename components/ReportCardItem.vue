<template>
  <Card>
    <template #title>
      Смена {{ dateToDDMMYYYY(new Date(shiftStatistics.shift_date)) }}
      <template v-if="shiftStatistics.is_extra_shift">(доп.смена)</template>
    </template>
    <template #content>
      <ReportCardItemStatistics :shift-statistics="shiftStatistics" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import ReportCardItemStatistics from "~/components/ReportCardItemStatistics.vue"
import type { ShiftStatistics } from "~/types/reports"

defineProps<{
  shiftStatistics: ShiftStatistics
}>()

const dateToYYYYMMDD = (date?: Date): string | undefined => {
  if (date === undefined) return
  return date.toISOString().split("T")[0]
}

const dateToDDMMYYYY = (date?: Date): string | undefined => {
  if (date === undefined) return
  const [year, month, day] = dateToYYYYMMDD(date)!.split("-")
  return `${day}.${month}.${year}`
}
</script>
