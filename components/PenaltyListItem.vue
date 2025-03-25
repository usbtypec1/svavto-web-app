<template>
  <Message severity="error">
    <p><i class="pi pi-receipt" /> Причина: {{ formattedPenaltyReason }}</p>
    <p class="flex items-center gap-x-1">
      <i class="pi pi-money-bill" /> Цена: {{ penalty.amount }}₽
    </p>
    <p class="flex items-center gap-x-1">
      <i class="pi pi-calendar" />Дата: {{ format(penalty.date, "dd.MM.yyyy") }}
    </p>
    <p class="flex items-center gap-x-1">
      <i class="pi pi-calendar-clock" /> Дата выдачи штрафа:
      {{ format(penalty.created_at, "dd.MM.yyyy HH:mm") }}
    </p>
    <Tag
      v-if="penalty.consequence !== null"
      :value="formattedPenaltyConsequence"
      severity="danger"
      rounded
      icon="pi pi-exclamation-triangle"
      class="mt-1"
    />
  </Message>
</template>

<script setup lang="ts">
import { format } from "date-fns"
import type {
  CarTransporterPenalty,
  PenaltyConsequence,
} from "~/types/penalties"

const props = defineProps<{
  penalty: CarTransporterPenalty
}>()

const penaltyReasonToName: Record<string, string> = {
  late_report: "Отчет не вовремя",
  not_showing_up: "Невыход",
  early_leave: "Ранний уход",
}

const formattedPenaltyReason = computed((): string => {
  return penaltyReasonToName[props.penalty.reason] ?? props.penalty.reason
})

const penaltyConsequenceToName: Record<PenaltyConsequence, string> = {
  warn: "Предупреждение",
  dismissal: "Увольнение",
}

const formattedPenaltyConsequence = computed((): string => {
  if (props.penalty.consequence === null) {
    return ""
  }
  return penaltyConsequenceToName[props.penalty.consequence]
})
</script>
