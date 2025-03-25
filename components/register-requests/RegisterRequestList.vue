<template>
  <RegisterRequestListItem
    @accept="emit('accept', $event)"
    @reject="emit('reject', $event)"
    v-for="staffRegisterRequest in staffRegisterRequests"
    :staff-register-request="staffRegisterRequest"
  />
  <Message
    v-if="staffRegisterRequests.length === 0"
    icon="pi pi-check"
    severity="warn"
  >
    Нет заявок на регистрацию
  </Message>
</template>

<script setup lang="ts">
import type { StaffRegisterRequest } from "~/types/staff-register-requests"

defineProps<{
  staffRegisterRequests: StaffRegisterRequest[]
}>()

const emit = defineEmits<{
  accept: [id: number]
  reject: [id: number]
}>()
</script>
