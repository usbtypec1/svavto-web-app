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
    <template #list="{ items }: { items: CarTransporterPenalty[] }">
      <div class="flex flex-col divide-solid divide-y-2">
        <div v-for="penalty in items" :key="penalty.id">
          <div class="flex items-center justify-between px-4 py-3">
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
          <div class="p-4 grid grid-cols-5 gap-3">
            <Image
              v-for="photoUrl in penalty.photo_urls"
              :key="photoUrl"
              :src="photoUrl"
              alt="Фото штрафа"
              preview
            >
              <template #image>
                <NuxtImg
                  :src="photoUrl"
                  placeholder
                  quality="75"
                  format="webp"
                  alt="Фото штрафа"
                />
              </template>
              <template #preview>
                <NuxtImg
                  :src="photoUrl"
                  quality="100"
                  format="webp"
                  alt="Фото штрафа"
                  loading="lazy"
                />
              </template>
            </Image>
          </div>
        </div>
      </div>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import { formatDate } from "date-fns"
import type { CarTransporterPenalty } from "~/types/penalties"
import type { StaffIdAndName } from "~/types/staff"

defineProps<{
  staff: StaffIdAndName
  carTransporterPenalties: CarTransporterPenalty[]
}>()

const emit = defineEmits<{
  deletePenalty: [penaltyId: number]
}>()
</script>
