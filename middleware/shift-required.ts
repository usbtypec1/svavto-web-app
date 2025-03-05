import { useActiveShift } from "~/composables/shifts"

export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return

  const userId = Number(to.params.userId as string)

  if (!userId) {
    return navigateTo({ name: "shifts-no-active" })
  }

  const { status, data } = await useActiveShift(userId)

  if (status.value !== "success" || !data.value) {
    return navigateTo({ name: "shifts-no-active" })
  }

  useState<number>("shiftId", () => data.value.id)
})
