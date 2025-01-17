<template>
  <Card>
    <template #title>Итоги за период</template>
    <template #content>
      <section
        class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600"
      >
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
  </Card>
</template>

<script setup lang="ts">
import type { ShiftStatistics, TotalShiftStatistics } from "~/types/reports"

const { shiftsStatistics = [] } = defineProps<{
  shiftsStatistics: ShiftStatistics[]
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

const totalShiftStatistics = computed((): TotalShiftStatistics => {
  const totalStatistics: TotalShiftStatistics = {
    penalty_amount: 0,
    surcharge_amount: 0,
    planned_comfort_cars_washed_count: 0,
    planned_business_cars_washed_count: 0,
    planned_vans_washed_count: 0,
    urgent_cars_washed_count: 0,
    dry_cleaning_items_count: 0,
    extra_shifts_count: 0,
    washed_cars_total_cost: 0,
  }
  for (const shiftStatistics of shiftsStatistics) {
    totalStatistics.penalty_amount += shiftStatistics.penalty_amount
    totalStatistics.surcharge_amount += shiftStatistics.surcharge_amount
    totalStatistics.planned_comfort_cars_washed_count +=
      shiftStatistics.planned_comfort_cars_washed_count
    totalStatistics.planned_business_cars_washed_count +=
      shiftStatistics.planned_business_cars_washed_count
    totalStatistics.planned_vans_washed_count +=
      shiftStatistics.planned_vans_washed_count
    totalStatistics.urgent_cars_washed_count +=
      shiftStatistics.urgent_cars_washed_count
    totalStatistics.dry_cleaning_items_count +=
      shiftStatistics.dry_cleaning_items_count
    totalStatistics.extra_shifts_count += shiftStatistics.is_extra_shift ? 1 : 0
    totalStatistics.washed_cars_total_cost +=
      shiftStatistics.washed_cars_total_cost
  }
  return totalStatistics
})
</script>
