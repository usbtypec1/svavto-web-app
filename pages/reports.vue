<template>
  <div>
    <p class="font-semibold text-lg">Выберите промежуток отчетного периода</p>
    <DatePicker
      v-model="reportPeriodDates"
      selection-mode="range"
      :manual-input="false"
      fluid
    />
    <div v-if="reportPeriods.length > 0" class="my-3">
      <p class="font-semibold text-md">Выберите отчетный период</p>
      <Listbox
        v-model="selectedReportPeriod"
        :options="reportPeriods"
        :option-label="formatPeriod"
      />
    </div>

    <template v-if="status === 'success'">
      <Message
        v-if="data!.length === 0"
        severity="error"
        variant="simple"
        class="my-2"
        size="large"
      >
        Данные не найдены
      </Message>
      <div class="flex flex-col gap-y-3 my-3">
        <ReportCardItem
          v-for="shiftStatistics in data![0].shifts_statistics"
          :shift-statistics="shiftStatistics"
          :key="shiftStatistics.shift_date"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ReportPeriod } from "~/types/report-periods"

const formatPeriod = ({ fromDate, toDate }: ReportPeriod): string => {
  return `${dateToDDMMYYYY(fromDate)}-${dateToDDMMYYYY(toDate)}`
}

const dateToYYYYMMDD = (date?: Date): string | undefined => {
  if (date === undefined) return
  return date.toISOString().split("T")[0]
}

const dateToDDMMYYYY = (date?: Date): string | undefined => {
  if (date === undefined) return
  const [year, month, day] = dateToYYYYMMDD(date)!.split("-")
  return `${day}.${month}.${year}`
}

const userId = 7525893335

const reportPeriodDates = ref([])

const reportPeriods = computed((): ReportPeriod[] => {
  if (reportPeriodDates.value.length !== 2) return []
  const [fromDate, toDate] = reportPeriodDates.value
  if (!fromDate || !toDate) return []
  return getReportPeriods({ fromDate, toDate })
})

const runtimeConfig = useRuntimeConfig()

const queryParams = computed(() => ({
  from_date: dateToYYYYMMDD(selectedReportPeriod.value?.fromDate),
  to_date: dateToYYYYMMDD(selectedReportPeriod.value?.toDate),
  staff_ids: userId,
}))
const selectedReportPeriod = ref<ReportPeriod>()
const { data, execute, status } = useFetch(
  "https://avtomoykabot.store/api/economics/reports/staff-shifts-statistics/",
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
    immediate: false,
    query: queryParams,
    transform(data: { staff_list: any[] }): any[] {
      return data.staff_list
    },
  },
)
</script>
