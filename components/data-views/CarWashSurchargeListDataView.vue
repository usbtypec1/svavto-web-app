<template>
  <DataView
    paginator
    :rows="10"
    :always-show-paginator="false"
    data-key="id"
    :value="carWashSurcharges"
  >
    <template #header><h3 class="text-lg font-semibold">💰 Список доплат</h3></template>
    <template #empty>
      <Message severity="warn">😔 Нет доплат</Message>
    </template>
    <template #list="{ items }">
      <div class="flex flex-col divide-solid divide-y-2">
        <div
          v-for="surcharge in items"
          :key="surcharge.id"
          class="flex items-center justify-between px-4 py-3"
        >
          <div>
            <p class="text-lg font-semibold flex items-center gap-x-1">
              Сумма: {{ surcharge.amount }} рублей
            </p>
            <p class="text-gray-500">Причина: {{ surcharge.reason }}</p>
            <p class="text-gray-500 text-sm flex items-center gap-x-1">
              Дата: {{ formatDate(parseISO(surcharge.date), "dd.MM.yyyy") }}
            </p>
            <p class="text-gray-500 text-sm flex items-center gap-x-1">
              Дата доплаты: {{ formatDate(parseISO(surcharge.created_at), "dd.MM.yyyy HH:mm") }}
            </p>
          </div>
          <div>
            <Button
              @click="emit('deleteSurcharge', surcharge.id)"
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
import type { CarWashSurcharge } from "~/types/surcharges"

defineProps<{
  carWashSurcharges: CarWashSurcharge[]
}>()

const emit = defineEmits<{
  deleteSurcharge: [surchargeId: number]
}>()
</script>
