<template>
  <DataView
    paginator
    :rows="10"
    :always-show-paginator="false"
    data-key="id"
    :value="carTransporterPenalties"
  >
    <template #empty>
      <Message icon="pi pi-face-smile" severity="success">Нет штрафов</Message>
    </template>
    <template #list="{ items }">
      <div class="flex flex-col divide-solid divide-y-2">
        <div
          v-for="penalty in items"
          :key="penalty.id"
          class="flex items-center justify-between px-4 py-3"
        >
          <div>
            <p class="text-lg font-semibold flex items-center gap-x-1">
              Сумма: {{ penalty.amount }} рублей
            </p>
            <p class="text-gray-500">Причина: {{ penalty.reason }}</p>
            <p class="text-gray-500 text-sm flex items-center gap-x-1">
              Дата: {{ formatDate(penalty.created_at, "dd.MM.yyyy HH:mm") }}
            </p>
          </div>
          <div>
            <Button
              @click="emit('deletePenalty', penalty.id)"
              text
              icon="pi pi-trash"
              severity="danger"
            />
          </div>
        </div>
      </div>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import { formatDate } from "date-fns"
import type { Penalty } from "~/types/penalties"
import type { StaffIdAndName } from "~/types/staff"

defineProps<{
  staff: StaffIdAndName
  carTransporterPenalties: Penalty[]
}>()

const emit = defineEmits<{
  deletePenalty: [penaltyId: number]
}>()
</script>
