<template>
  <DataView
    paginator
    :rows="10"
    :always-show-paginator="false"
    data-key="id"
    :value="carTransporterSurcharges"
  >
    <template #empty>
      <Message severity="error">🙁 Нет доплат</Message>
    </template>
    <template #list="{ items: surcharges }: { items: Surcharge[] }">
      <div class="flex flex-col divide-solid divide-y-2">
        <div v-for="surcharge in surcharges" :key="surcharge.id">
          <div class="flex items-center justify-between px-4 py-3">
            <div>
              <p class="text-lg font-semibold flex items-center gap-x-1">
                Сумма: {{ surcharge.amount }} рублей
              </p>
              <p class="text-gray-500">Причина: {{ surcharge.reason }}</p>
              <p class="text-gray-500 text-sm flex items-center gap-x-1">
                Дата: {{ formatDate(surcharge.created_at, "dd.MM.yyyy HH:mm") }}
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
      </div>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import { formatDate } from "date-fns"
import type { StaffIdAndName } from "~/types/staff"
import type { Surcharge } from "~/types/surcharges"

defineProps<{
  staff: StaffIdAndName
  carTransporterSurcharges: Surcharge[]
}>()

const emit = defineEmits<{
  deleteSurcharge: [Id: number]
}>()
</script>
