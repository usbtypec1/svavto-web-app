<template>
  <div>
    <div class="flex flex-col gap-y-3">
      <label class="font-semibold">Отчет за период</label>
      <DatePicker
        v-model="datesRange"
        selection-mode="range"
        :manual-input="false"
        class="w-full"
      />
      <Message
        severity="error"
        icon="pi pi-exclamation-circle"
        v-if="isRangeGreaterThan30Days"
      >
        Период должен быть не больше 30 дней

      </Message>
      <Message
        severity="warn"
        icon="pi pi-info-circle"
        v-if="!isRangeSelected"
      >
        Выберите период
      </Message>
      <div class="flex justify-between gap-x-3">
        <Button
          class="flex-1"
          @click="datesRange = []"
          label="Очистить"
          severity="secondary"
          icon="pi pi-times"
        />
        <Button
          @click="execute"
          :disabled="!isValidRange"
          class="w-full flex-1"
          icon="pi pi-search"
          label="Построить"
        />
      </div>
    </div>
    <div v-if="status === 'success'" class="my-4">
      <Divider/>
      <p class="text-lg font-semibold my-2">Общая статистика</p>
      <DataTable
        :value="totalStatistics"
      >
        <Column header="Поле" field="key"/>
        <Column header="Значение" field="value"/>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userIdKey } from '~/utils/keys'

const datesRange = ref<Date[]>([])

const runtimeConfig = useRuntimeConfig()

const rangeInDays = computed((): number => {
  const [start, end] = datesRange.value
  if (!start || !end) return 0
  return Math.abs(start.getTime() - end.getTime()) / (24 * 60 * 60 * 1000)
})

const isRangeGreaterThan30Days = computed((): boolean => rangeInDays.value > 30)

const isRangeSelected = computed((): boolean => datesRange.value.length === 2)

const isValidRange = computed((): boolean => {
  return isRangeSelected.value && !isRangeGreaterThan30Days.value
})

const dateToYYYYMMDDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const staffId = inject(userIdKey)

const queryParams = computed((): Record<string, string> | undefined => {
    const [start, end] = datesRange.value
    if (!start || !end) return
    return {
      from_date: dateToYYYYMMDDD(start),
      to_date: dateToYYYYMMDDD(end),
    }
  },
)

const { data, execute, status } = useFetch(`/shifts/reports/staff/${staffId}/`, {
  baseURL: runtimeConfig.public.apiBaseUrl,
  watch: false,
  immediate: false,
  query: queryParams,
})

const fieldToName = {
  shifts_count: 'Количество смен',
  cars_washed: 'Отогнано на мойку ТС',
  comfort_cars: 'ТС комфорт класса',
  business_cars: 'ТС бизнес класса',
  van_cars: 'ТС класса фургон',
  planned_washes: 'Запланированных моек',
  urgent_washes: 'Срочных моек',
  additional_services_count: 'Доп.услуг оказано',
  surcharge_count: 'Количество доплат',
  surcharge_total: 'Общая сумма доплаты в рублях',
  penalty_count: 'Количество штрафов',
}

const totalStatistics = computed(() => {
  const periodStatistics = data.value?.period_totals ?? {}
  const financialStatistics = data.value?.financial_stats ?? {}
  const totals = { ...periodStatistics, ...financialStatistics }
  const result = []
  for (const [key, value] of Object.entries(totals)) {
    result.push({ key: fieldToName[key] ?? key, value })
  }
  return result
})

</script>
