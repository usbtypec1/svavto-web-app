import type { Staff } from '~/types/staff'

export const useStaffStore = defineStore('staffStore', () => {
  const staffList = ref<Staff[]>()

  const runtimeConfig = useRuntimeConfig()

  const fetchAll = async () => {
    const url = `${runtimeConfig.public.apiBaseUrl}/staff/`
    const response = await $fetch<{ staff: Staff[] } >(url)
    if (response.staff) {
      staffList.value = response.staff
    }
  }

  const notBannedStaff = computed(() => {
    return staffList.value?.filter(staffItem => !staffItem.is_banned)
  })

  return {
    staffList,
    fetchAll,
    notBannedStaff,
  }
})
