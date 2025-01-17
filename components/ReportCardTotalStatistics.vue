<template>
  <section class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
    <div
      v-for="{ key, label } in keysAndLabels"
      class="flex justify-between py-2"
      :key="key"
    >
      <span>
        {{ label }}
      </span>
      <span>
        {{ totalShiftStatistics[key as keyof TotalShiftStatistics] }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TotalShiftStatistics } from "~/types/reports"

defineProps<{
  totalShiftStatistics: TotalShiftStatistics
}>()

interface KeyAndLabel {
  key: string
  label: string
}

const keysAndLabels: KeyAndLabel[] = [
  {
    key: "penalty_amount",
    label: "Штрафы",
  },
  {
    key: "surcharge_amount",
    label: "Доплаты",
  },
  {
    key: "planned_comfort_cars_washed_count",
    label: "Комфорт",
  },
  {
    key: "planned_business_cars_washed_count",
    label: "Бизнес",
  },
  {
    key: "planned_vans_washed_count",
    label: "Фургон",
  },
  {
    key: "urgent_cars_washed_count",
    label: "Срочные",
  },
  {
    key: "dry_cleaning_items_count",
    label: "Химчистка",
  },
  {
    key: "extra_shifts_count",
    label: "Доп.смены",
  },
  {
    key: "washed_cars_total_cost",
    label: "Заработано",
  },
]
</script>
