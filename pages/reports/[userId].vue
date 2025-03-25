<template>
  <div>
    <p class="font-semibold text-lg">Выберите отчетный период</p>
    <Listbox
      v-model="reportPeriod"
      :options="reportPeriods!"
      :option-label="formatPeriod"
      empty-message="У вас не было смен"
    />

    <template v-if="staffShiftsStatisticsStatus === 'success'">
      <template v-if="staffShiftsStatistics !== null">
        <ReportCardTotalStatistics
          :total-statistics="staffShiftsStatistics.total_statistics"
          class="my-3"
        />
        <Inplace>
          <template #display>
            <span class="pi pi-list mr-1.5"></span>
            <span class="text-lg">Подробнее</span>
          </template>
          <template #content>
            <div class="flex flex-col gap-y-3 my-3">
              <ReportCardItem
                v-for="shiftStatistics in staffShiftsStatistics.shifts_statistics.toSorted(
                  (a, b) => a.shift_date.localeCompare(b.shift_date),
                )"
                :shift-statistics="shiftStatistics"
                :key="shiftStatistics.shift_date"
              />
            </div>
          </template>
        </Inplace>
      </template>
    </template>
    <div v-else-if="staffShiftsStatisticsStatus === 'pending'" class="my-3">
      <Skeleton v-for="key in 8" :key="key" height="2rem" class="mb-2" />
    </div>
    <Message
      v-else-if="staffShiftsStatisticsStatus === 'error'"
      severity="error"
      variant="simple"
      class="my-3"
      size="large"
    >
      Произошла ошибка при загрузке данных
    </Message>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns"
import type { ReportPeriod } from "~/types/report-periods"
import type { StaffShiftsStatistics } from "~/types/reports"

const formatPeriod = ({ from_date, to_date }: ReportPeriod): string => {
  return `${format(from_date, "dd.MM.yyyy")}-${format(to_date, "dd.MM.yyyy")}`
}

const route = useRoute()
const staffId = Number(route.params.userId as string)

const runtimeConfig = useRuntimeConfig()

const { data: reportPeriods } = await useFetch(
  `/shifts/report-periods/staff/${staffId}/`,
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
    transform(data: { periods: ReportPeriod[] }): ReportPeriod[] {
      return data.periods
    },
  },
)
const reportPeriod = ref<ReportPeriod | null>(null)

const staffShiftsStatisticsQueryParams = computed(() => {
  const { number, month, year } = reportPeriod.value ?? {}

  return {
    staff_ids: staffId,
    report_period_number: number,
    year,
    month,
  }
})

const {
  data: staffShiftsStatistics,
  status: staffShiftsStatisticsStatus,
  refresh: refreshStaffShiftsStatistics,
  clear: clearStaffShiftsStatistics,
} = useFetch("/economics/reports/staff-shifts-statistics/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  immediate: false,
  watch: false,
  query: staffShiftsStatisticsQueryParams,
  transform(data: {
    staff_list: StaffShiftsStatistics[]
  }): StaffShiftsStatistics | null {
    return data.staff_list[0] ?? null
  },
})
watch(reportPeriod, async (value) => {
  if (value === null) {
    clearStaffShiftsStatistics()
  } else {
    await refreshStaffShiftsStatistics()
  }
})
</script>
