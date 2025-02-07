import type { StaffIdAndName, Staff } from "~/types/staff"

export const useStaffList = () => {
  const runtimeConfig = useRuntimeConfig()

  const { data, status } = useFetch(
    "/staff/",
    {
      baseURL: runtimeConfig.public.apiBaseUrl,
      query: {
        order_by: "-created_at",
      },
      transform(data: { staff: Staff[] }): StaffIdAndName[] {
        return data.staff.map((staff: Staff) => ({
          id: staff.id,
          full_name: staff.full_name,
        }))
      },
    },
  )
  
  return {
    data,
    status,
  }
}
