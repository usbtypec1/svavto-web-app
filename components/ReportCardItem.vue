<template>
  <Card>
    <template #title>
      Смена {{ format(parseISO(shiftStatistics.date), "dd.MM.yyyy") }}
      <template v-if="shiftStatistics.is_extra_shift">(доп.смена)</template>
    </template>
    <template #content>
      <ReportCardItemStatistics :shift-statistics="shiftStatistics" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { ShiftStatistics } from "~/types/reports"
import { format, parseISO } from "date-fns"

defineProps<{
  shiftStatistics: ShiftStatistics
}>()
</script>
