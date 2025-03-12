<template>
  <DataView
    paginator
    :rows="10"
    :always-show-paginator="false"
    data-key="id"
    :value="
      requests.toSorted((a, b) => a.created_at.localeCompare(b.created_at))
    "
  >
    <template #header
      ><h3 class="text-lg font-semibold">🫧 Запросы на химчистку</h3></template
    >
    <template #empty>
      <Message severity="secondary">Нет запросов на химчистку</Message>
    </template>
    <template #list="{ items: requests }: { items: DryCleaningRequest[] }">
      <div class="flex flex-col divide-solid divide-y-2" v-auto-animate>
        <div
          v-for="request in requests"
          :key="request.id"
          class="flex flex-col gap-y-2 px-4 py-3"
        >
          <div>
            <p class="text-lg font-semibold flex items-center gap-x-1">
              Гос.номер: {{ request.car_number }}
            </p>
            <p class="text-sm font-normal flex items-center gap-x-1">
              Сотрудник: {{ request.staff_full_name }}
            </p>
            <p
              v-for="service in request.services"
              :key="service.id"
              class="text-xs text-gray-500 dark:text-gray-200 font-normal"
            >
              {{ service.name }}
              <span v-if="service.is_countable">
                - {{ service.count }} элементов</span
              >
            </p>
          </div>
          <div>
            <Button
              @click="emit('openRequest', request.id)"
              fluid
              text
              label="Открыть в боте"
              icon="pi pi-link"
              severity="primary"
            />
          </div>
        </div>
      </div>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import type { DryCleaningRequest } from "~/types/dry-cleaning-requests"

defineProps<{
  requests: DryCleaningRequest[]
}>()

const emit = defineEmits<{
  openRequest: [dryCleaningRequestId: number]
}>()
</script>
