<template>
  <section class="flex flex-col divide-y divide-gray-200 dark:divide-gray-600">
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
        {{ shiftStatistics[key as keyof ShiftStatistics] }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ShiftStatistics } from "~/types/reports"

const props = defineProps<{
  shiftStatistics: ShiftStatistics
}>()

interface KeyAndLabel {
  key: string
  label: string
  icon: string
}

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
    props.shiftStatistics.planned_comfort_cars_washed_count +
    props.shiftStatistics.planned_business_cars_washed_count +
    props.shiftStatistics.planned_vans_washed_count
  )
})

const totalCarsCount = computed(() => {
  return plannedCarsCount.value + props.shiftStatistics.urgent_cars_washed_count
})

const treeNodes = [
  {
    key: "planned",
    label: `Плановая - ${plannedCarsCount.value}`,
    icon: "pi pi-calendar-clock",
    children: [
      {
        key: "comfort",
        label: `Комфорт - ${props.shiftStatistics.planned_comfort_cars_washed_count}`,
        icon: "pi pi-car",
      },
      {
        key: "business",
        label: `Бизнес - ${props.shiftStatistics.planned_business_cars_washed_count}`,
        icon: "pi pi-car",
      },
      {
        key: "van",
        label: `Фургон - ${props.shiftStatistics.planned_vans_washed_count}`,
        icon: "pi pi-truck",
      },
    ],
  },
  {
    key: "urgent",
    label: `Срочная - ${props.shiftStatistics.urgent_cars_washed_count}`,
    icon: "pi pi-bolt",
  },
]

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
</script>
