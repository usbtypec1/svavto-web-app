<template>
  <Message
    severity="error"
  >
    <p><i class="pi pi-receipt"/> Причина: {{ penaltyToName[penalty.reason] ?? penalty.reason }}</p>
    <p class="flex items-center gap-x-1"><i class="pi pi-money-bill"/> Цена: {{ penalty.amount }}₽</p>
    <p class="flex items-center gap-x-1"><i class="pi pi-calendar"/> Дата: {{ formattedDate }}</p>
    <Tag
      v-if="penalty.consequence === 'warn'"
      value="Предупреждение"
      severity="danger"
      rounded
      icon="pi pi-exclamation-triangle"
    />
    <Tag
      v-if="penalty.consequence === 'dismissal'"
      value="Увольнение"
      severity="danger"
      rounded
      icon="pi pi-exclamation-triangle"
    />
  </Message>
</template>

<script setup lang="ts">
import type { Penalty } from '~/types/penalties'

const props = defineProps<{
  penalty: Penalty,
}>()

const formattedDate = useDateFormat(props.penalty.created_at, 'DD.MM.YYYY HH:mm')

const penaltyToName = {
  late_report: 'Отчет не вовремя',
  not_showing_up: 'Невыход',
  early_leave: 'Ранний уход',
}
</script>
