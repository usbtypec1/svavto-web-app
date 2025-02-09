<template>
  <Card :key="staffRegisterRequest.id">
    <template #title> ФИО: {{ staffRegisterRequest.full_name }} </template>
    <template #content>
      <div>
        <p>
          <i class="pi pi-phone" />
          <span class="font-semibold"> Номер телефона в каршеринге: </span>
          {{ staffRegisterRequest.car_sharing_phone_number }}
        </p>
        <p>
          <i class="pi pi-phone" />
          <span class="font-semibold"> Номер телефона в компании Консоль: </span>
          {{ staffRegisterRequest.console_phone_number }}
        </p>
        <p>
          <i class="pi pi-calendar-clock" />
          <span class="font-semibold"> Дата регистрации: </span>
          {{ formattedCreatedAt }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex justify-between gap-x-3">
        <Button
          @click="emit('accept', staffRegisterRequest.id)"
          class="grow"
          icon="pi pi-check"
          label="Принять"
          severity="success"
        />
        <Button
          @click="emit('reject', staffRegisterRequest.id)"
          class="grow"
          icon="pi pi-times"
          label="Отклонить"
          severity="danger"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { StaffRegisterRequest } from "~/types/staff-register-requests"

const props = defineProps<{
  staffRegisterRequest: StaffRegisterRequest
}>()

const emit = defineEmits<{
  accept: [id: number]
  reject: [id: number]
}>()

const formattedCreatedAt = useDateFormat(
  () => props.staffRegisterRequest.created_at,
  "DD.MM.YYYY HH:mm",
)
</script>
