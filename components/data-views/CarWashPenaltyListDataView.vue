<template>
  <DataView
    paginator
    :rows="10"
    :always-show-paginator="false"
    data-key="id"
    :value="carWashPenalties"
  >
  <template #header><h3 class="text-lg font-semibold">❌ Список штрафов</h3></template>
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
              Дата: {{ formatDate(parseISO(penalty.date), "dd.MM.yyyy") }}
            </p>
            <p class="text-gray-500 text-sm flex items-center gap-x-1">
              Дата выдачи штрафа: {{ formatDate(parseISO(penalty.created_at), "dd.MM.yyyy HH:mm") }}
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
import { formatDate, parseISO } from "date-fns"
import type { CarWashPenalty } from "~/types/penalties"

defineProps<{
  carWashPenalties: CarWashPenalty[]
}>()

const emit = defineEmits<{
  deletePenalty: [penaltyId: number]
}>()
</script>
