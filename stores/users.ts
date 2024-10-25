export const useUserStore = defineStore('userStore', () => {
  const userId = ref<number>()

  const setUserId = (id: number) => {
    if (userId.value) {
      throw new Error('User ID is already set')
    }
    userId.value = id
  }

  return {
    userId,
    setUserId,
  }
})
