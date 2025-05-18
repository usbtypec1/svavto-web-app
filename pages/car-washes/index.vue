<template>
  <div class="flex flex-col gap-y-4">
    <h3 class="font-semibold text-xl mb-2">Список моек</h3>
    <SelectButton v-model="filterOption" :options="filterOptions" />
    <div v-if="filteredCarWashes.length > 0" class="flex flex-col gap-y-2">
      <NuxtLink
        v-for="carWash in filteredCarWashes"
        :key="carWash.id"
        :to="{ name: 'car-washes-id', params: { id: carWash.id } }"
      >
        <Card>
          <template #content>
            <p>{{ carWash.name }}</p>
            <Message
              v-if="carWash.is_hidden"
              variant="simple"
              severity="warn"
              size="small"
              icon="pi pi-exclamation-triangle"
            >
              Скрыто
            </Message>
          </template>
        </Card>
      </NuxtLink>
    </div>
    <Message
      v-else
      severity="warn"
      icon="pi pi-exclamation-triangle"
      variant="outlined"
      class="my-3"
    >
      Нет моек
    </Message>
    <FloatingCornerButton page-name="car-washes-create" severity="success" icon="pi pi-plus" />
  </div>
</template>

<script setup lang="ts">
import type { CarWash } from "~/types/car-washes"

const filterOptions: string[] = ["Все", "Скрытые", "Не скрытые"]
const filterOption = ref(filterOptions[0])

const { data: carWashes } = await useApi("/car-washes/", {
  transform: (data: any): CarWash[] => data.car_washes,
})

const filteredCarWashes = computed((): CarWash[] => {
  if (!carWashes.value) {
    return []
  }
  if (filterOption.value === "Все") {
    return carWashes.value
  } else if (filterOption.value === "Скрытые") {
    return carWashes.value.filter((carWash) => carWash.is_hidden)
  } else {
    return carWashes.value.filter((carWash) => !carWash.is_hidden)
  }
})
</script>
