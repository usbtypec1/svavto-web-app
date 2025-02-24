import type { StaffIdAndName, Staff } from "~/types/staff"

export const useStaffList = () => {
  const runtimeConfig = useRuntimeConfig()

  const { data, status } = useFetch("/staff/", {
    baseURL: runtimeConfig.public.apiBaseUrl,
    query: {
      order_by: "-created_at",
    },
    transform(data: { staff: Staff[] }): StaffIdAndName[] {
      return data.staff
        .filter((staff: Staff): boolean => staff.banned_at === null)
        .map((staff: Staff) => ({
          id: staff.id,
          full_name: staff.full_name,
        }))
    },
  })

  return {
    data,
    status,
  }
}
