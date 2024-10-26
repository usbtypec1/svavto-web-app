import type { Staff } from '~/types/staff'

export const useStaffStore = defineStore('staffStore', () => {
  const staffList = ref<Staff[]>([])

  const runtimeConfig = useRuntimeConfig()

  const fetchAll = async () => {
    const url = `${runtimeConfig.public.apiBaseUrl}/staff/`
    const response = await $fetch<{ staff: Staff[] }>(url)
    if (response.staff) {
      staffList.value = response.staff
    }
  }

  const fetchById = async (staffId: number): Promise<Staff | null> => {
    const url = `${runtimeConfig.public.apiBaseUrl}/staff/${staffId}/`
    try {
      return await $fetch<Staff>(url)
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const notBannedStaff = computed(() => {
    return staffList.value?.filter(staffItem => !staffItem.is_banned)
  })

  const findById = (staffId: number): Staff | null => {
    return staffList.value.find(staffItem => staffItem.id === staffId) ?? null
  }

  return {
    staffList,
    fetchAll,
    notBannedStaff,
    findById,
    fetchById,
  }
})
