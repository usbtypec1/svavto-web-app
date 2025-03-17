<template>
  <Card>
    <template #title>Итоги за период</template>
    <template #content>
      <section
        class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600"
      >
        <div class="py-2">
          <div class="flex items-center gap-x-2">
            <i class="pi pi-car"></i>
            <span class="font-semibold">Всего - {{ totalCarsCount }}</span>
          </div>
          <Tree
            :pt="{
              root: {
                style: {
                  margin: 0,
                  padding: 0,
                },
              },
            }"
            :value="treeNodes"
            v-model:expanded-keys="expanded"
            class="p-0 m-0"
          />
        </div>
        <div
          v-for="{ key, label, icon } in keysAndLabels"
          class="flex justify-between py-2"
          :key="key"
        >
          <div class="flex items-center gap-x-2">
            <i class="pi" :class="icon"></i>
            <span>
              {{ label }}
            </span>
          </div>
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
  icon: string
}

const keysAndLabels: KeyAndLabel[] = [
  {
    key: "penalty_amount",
    label: "Штрафы",
    icon: "pi pi-exclamation-triangle",
  },
  {
    key: "surcharge_amount",
    label: "Доплаты",
    icon: "pi pi-plus-circle",
  },
  {
    key: "dry_cleaning_items_count",
    label: "Химчистка",
    icon: "pi pi-car",
  },
  {
    key: "extra_shifts_count",
    label: "Доп. смены",
    icon: "pi pi-clock",
  },
  {
    key: "road_accident_fund_amount",
    label: "Фонд ДТП (3%)",
    icon: "pi pi-file-check",
  },
  {
    key: "fine_deposit_amount",
    label: "Залог на оплату штрафов",
    icon: "pi pi-camera",
  },
  {
    key: "washed_cars_total_cost",
    label: "Заработано",
    icon: "pi pi-money-bill",
  },
]

const expanded = {
  total: true,
  planned: true,
  urgent: true,
  comfort: true,
  business: true,
  van: true,
}

const plannedCarsCount = computed(() => {
  return (
    totalShiftStatistics.value.planned_comfort_cars_washed_count +
    totalShiftStatistics.value.planned_business_cars_washed_count +
    totalShiftStatistics.value.planned_vans_washed_count
  )
})

const totalCarsCount = computed(() => {
  return (
    plannedCarsCount.value + totalShiftStatistics.value.urgent_cars_washed_count
  )
})

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

const treeNodes = [
  {
    key: "planned",
    label: `Плановая - ${plannedCarsCount.value}`,
    icon: "pi pi-calendar-clock",
    children: [
      {
        key: "comfort",
        label: `Комфорт - ${totalShiftStatistics.value.planned_comfort_cars_washed_count}`,
        icon: "pi pi-car",
      },
      {
        key: "business",
        label: `Бизнес - ${totalShiftStatistics.value.planned_business_cars_washed_count}`,
        icon: "pi pi-car",
      },
      {
        key: "van",
        label: `Фургон - ${totalShiftStatistics.value.planned_vans_washed_count}`,
        icon: "pi pi-truck",
      },
    ],
  },
  {
    key: "urgent",
    label: `Срочная - ${totalShiftStatistics.value.urgent_cars_washed_count}`,
    icon: "pi pi-bolt",
  },
]
</script>
