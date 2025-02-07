import type { ShiftListItem } from "~/types/shifts"
import type { StaffIdAndName } from "~/types/staff"

export const useShifts = (date: Ref<Date>) => {
  const formattedDate = useDateFormat(date, "YYYY-MM-DD")
  const runtimeConfig = useRuntimeConfig()

  const { data, refresh, status, clear } = useFetch("/shifts/v2/", {
    query: {
      from_date: formattedDate,
      to_date: formattedDate,
      limit: 1000,
      types: "regular",
    },
    baseURL: runtimeConfig.public.apiBaseUrl,
    transform(data: { shifts: ShiftListItem[] }): ShiftListItem[] {
      return data.shifts
    },
  })

  watch(date, async () => {
    if (date.value) {
      await refresh()
    }
  })

  const staffList = computed((): StaffIdAndName[] => {
    const staffIdToName = new Map<number, string>()
    for (const shift of data.value ?? []) {
      staffIdToName.set(shift.staff_id, shift.staff_full_name)
    }
    return Array.from(staffIdToName.entries()).map(([id, full_name]) => ({
      id,
      full_name,
    }))
  })

  const staffIds = computed((): number[] => {
    return staffList.value.map((staff) => staff.id)
  })

  return {
    data,
    refresh,
    status,
    clear,
    staffList,
    staffIds,
  }
}
