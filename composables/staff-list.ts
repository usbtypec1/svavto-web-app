import type { StaffIdAndName, Staff } from "~/types/staff"

type OrderOption = "-created_at" | "full_name"

export const useStaffList = (
  { orderBy }: { orderBy: OrderOption } = { orderBy: "-created_at" },
) => {
  return useApiFetch<StaffIdAndName[]>("/staff/", {
    query: {
      order_by: orderBy,
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
}
