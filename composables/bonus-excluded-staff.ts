export const useBonusExcludedStaff = () => {
  return useApiFetch<number[]>("/bonuses/excluded-staff/", {
    transform(data: { staff_ids: number[] }) {
      return data.staff_ids
    },
  })
}
