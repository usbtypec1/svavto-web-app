<template>
  <div>
    <template v-if="reportPeriodsStatus === 'pending'">
      <Skeleton v-for="key in 3" :key="key" height="2rem" class="mb-2" />
    </template>
    <template v-else-if="reportPeriodsStatus === 'success'">
      <section v-if="reportPeriods!.length > 0" class="flex flex-col gap-y-3">
        <p class="font-semibold text-lg">Выберите отчетный период</p>
        <Listbox
          v-model="reportPeriod"
          :options="reportPeriods!"
          :option-label="formatPeriod"
        />
      </section>
      <Message v-else severity="error" class="my-2" size="large">
        У вас не было смен
      </Message>
    </template>
    <Message
      v-else-if="reportPeriodsStatus === 'error'"
      severity="error"
      variant="simple"
      class="my-2"
      size="large"
    >
      Произошла ошибка при загрузке данных
    </Message>

    <template v-if="staffShiftsStatisticsStatus === 'success'">
      <template v-if="staffShiftsStatistics!.length > 0">
        <ReportCardTotalStatistics
          :shifts-statistics="staffShiftsStatistics![0].shifts_statistics"
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
                v-for="shiftStatistics in staffShiftsStatistics![0].shifts_statistics.toSorted((a, b) => a.shift_date.localeCompare(b.shift_date))"
                :shift-statistics="shiftStatistics"
                :key="shiftStatistics.shift_date"
              />
            </div>
          </template>
        </Inplace>
      </template>

      <Message
        v-if="staffShiftsStatistics!.length === 0"
        severity="error"
        variant="simple"
        class="my-2"
        size="large"
      >
        Данные не найдены
      </Message>
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
import { format, formatISO } from "date-fns"
import type { ReportPeriod } from "~/types/report-periods"
import type { StaffShiftsStatistics } from "~/types/reports"

const formatPeriod = ({ from_date, to_date }: ReportPeriod): string => {
  return `${format(from_date, "dd.MM.yyyy")}-${format(to_date, "dd.MM.yyyy")}`
}

const route = useRoute()
const staffId = Number(route.params.userId as string)

const runtimeConfig = useRuntimeConfig()

const { data: reportPeriods, status: reportPeriodsStatus } = useFetch(
  `/shifts/report-periods/staff/${staffId}/`,
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
    transform(data: { periods: ReportPeriod[] }): ReportPeriod[] {
      return data.periods
    },
  },
)

const queryParams = computed(() => {
  const { from_date, to_date } = reportPeriod.value ?? {}

  return {
    staff_ids: staffId,
    from_date: from_date
      ? formatISO(from_date, { representation: "date" })
      : undefined,
    to_date: to_date
      ? formatISO(to_date, { representation: "date" })
      : undefined,
  }
})
const reportPeriod = ref<ReportPeriod | null>(null)
const {
  data: staffShiftsStatistics,
  status: staffShiftsStatisticsStatus,
  refresh: refreshStaffShiftsStatistics,
  clear: clearStaffShiftsStatistics,
} = useFetch("/economics/reports/staff-shifts-statistics/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  immediate: false,
  watch: false,
  query: queryParams,
  transform(data: {
    staff_list: StaffShiftsStatistics[]
  }): StaffShiftsStatistics[] {
    return data.staff_list
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
