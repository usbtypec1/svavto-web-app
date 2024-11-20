<template>
  <div>
    <CarWashChooseDialog
      v-model:visible="isCarWashChooseDialogVisible"
    />
  </div>
</template>

<script setup lang="ts">
import type { CurrentShift } from '~/types/shifts'
import CarWashChooseDialog from '~/components/car-washes/dialogs/CarWashChooseDialog.vue'

// const runtimeConfig = useRuntimeConfig()
//
// const userId = inject(userIdKey)
//
// const {
//   data: currentShift,
//   status: currentShiftStatus,
//   error: currentShiftError,
// } = await useFetch<CurrentShift>(`/shifts/current/${userId}/`, {
//   baseURL: runtimeConfig.public.apiBaseUrl,
// })
//
// const currentShiftErrorCodes = computed((): string[] => {
//   if (currentShiftError.value === null) return []
//   return currentShiftError.value!.data.errors.map(({ code }) => code)
// })
//
// watchEffect(async () => {
//   if (currentShiftErrorCodes.value.includes('staff_has_no_active_shift')) {
//     await navigateTo({ name: 'shifts-no-active' })
//   }
// })

const isCarWashChooseDialogVisible = ref<boolean>(true)
</script>
