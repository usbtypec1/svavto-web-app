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
            <span class="font-semibold"
              >Всего - {{ totalStatistics.washed_cars_total_count }}</span
            >
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
          v-for="{ key, label, icon, withRubleSign } in keysAndLabels"
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
            {{ totalStatistics[key as keyof TotalShiftStatistics]
            }}<span v-if="withRubleSign">₽</span>
          </span>
        </div>
      </section>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { TotalShiftStatistics } from "~/types/reports"

const props = defineProps<{
  totalStatistics: TotalShiftStatistics
}>()

interface KeyAndLabel {
  key: string
  label: string
  icon: string
  withRubleSign?: boolean
}

const keysAndLabels: KeyAndLabel[] = [
  {
    key: "penalty_amount",
    label: "Штрафы",
    icon: "pi pi-exclamation-triangle",
    withRubleSign: true,
  },
  {
    key: "surcharge_amount",
    label: "Доплаты",
    icon: "pi pi-plus-circle",
    withRubleSign: true,
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
    key: "road_accident_deposit_amount",
    label: "Фонд ДТП (3%)",
    icon: "pi pi-file-check",
    withRubleSign: true,
  },
  {
    key: "fine_deposit_amount",
    label: "Залог на оплату штрафов",
    icon: "pi pi-camera",
    withRubleSign: true,
  },
  {
    key: "net_revenue",
    label: "Заработано",
    icon: "pi pi-money-bill",
    withRubleSign: true,
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
    props.totalStatistics.washed_cars_total_count -
    props.totalStatistics.urgent_cars_washed_count
  )
})

const treeNodes = [
  {
    key: "planned",
    label: `Плановая - ${plannedCarsCount.value}`,
    icon: "pi pi-calendar-clock",
    children: [
      {
        key: "comfort",
        label: `Комфорт - ${props.totalStatistics.planned_comfort_cars_washed_count}`,
        icon: "pi pi-car",
      },
      {
        key: "business",
        label: `Бизнес - ${props.totalStatistics.planned_business_cars_washed_count}`,
        icon: "pi pi-car",
      },
      {
        key: "van",
        label: `Фургон - ${props.totalStatistics.planned_vans_washed_count}`,
        icon: "pi pi-truck",
      },
    ],
  },
  {
    key: "urgent",
    label: `Срочная - ${props.totalStatistics.urgent_cars_washed_count}`,
    icon: "pi pi-bolt",
  },
]
</script>
