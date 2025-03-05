import { useWebApp } from "vue-tg"
import { useActiveShift } from "~/composables/shifts"

export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return
  
  const { initDataUnsafe } = useWebApp()
  const userId = initDataUnsafe?.user?.id

  if (!userId) {
    return navigateTo({ name: "shifts-no-active" })
  }

  const { status, data } = await useActiveShift(userId)

  if (status.value !== "success" || !data.value) {
    return navigateTo({ name: "shifts-no-active" })
  }

  useState<number>('shiftId', () => data.value.id)
})
