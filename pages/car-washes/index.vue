<template>
  <div>
    <ProgressSpinner v-if="status === 'pending'" />
    <template v-else-if="status === 'success'">
      <template v-if="carWashes!.length > 0">
        <h3 class="font-semibold text-xl mb-2">Список моек</h3>
        <div class="flex flex-col gap-y-3">
          <NuxtLink
            v-for="carWash in carWashes"
            :key="carWash.id"
            :to="{ name: 'car-washes-id', params: { id: carWash.id } }"
          >
            <Card>
              <template #content>{{ carWash.name }}</template>
            </Card>
          </NuxtLink>
        </div>
      </template>
      <Message
        v-else
        severity="warn"
        icon="pi pi-exclamation-triangle"
        variant="outlined"
        class="my-3"
      >
        Нет моек
      </Message>
      <NuxtLink :to="{ name: 'car-washes-create' }">
        <Button
          label="Добавить мойку"
          icon="pi pi-plus"
          fluid
          class="my-4"
          text
        />
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CarWashListItem } from "~/types/car-washes"

const runtimeConfig = useRuntimeConfig()

const { data: carWashes, status } = await useFetch("/car-washes/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { car_washes: CarWashListItem[] }): CarWashListItem[] =>
    data.car_washes,
})
</script>
