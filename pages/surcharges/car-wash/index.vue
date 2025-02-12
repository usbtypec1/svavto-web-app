<template>
  <div class="flex flex-col gap-y-3">
    <h1 class="text-xl font-bold">Выберите мойку которой хотите доплатить</h1>
    <template v-if="carWashesStatus === 'success'">
      <NuxtLink
        :to="{ name: 'surcharges-car-wash-id', params: { id: carWash.id } }"
        v-for="carWash in carWashes"
        :key="carWash.id"
      >
        <Card>
          <template #content>{{ carWash.name }}</template>
        </Card>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CarWashIdAndName } from "~/types/car-washes"

const runtimeConfig = useRuntimeConfig()

const { data: carWashes, status: carWashesStatus } = useFetch("/car-washes/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform(data: { car_washes: CarWashIdAndName[] }) {
    return data.car_washes
  },
})
</script>
