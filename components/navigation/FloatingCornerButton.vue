<template>
  <div class="fixed bottom-5 right-3">
    <NuxtLink :to="{ name: pageName }">
      <Button class="my-4" raised rounded size="large" :icon :severity />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const {
  pageName,
  severity,
  icon = "pi pi-arrow-left",
} = defineProps<{
  pageName: string
  severity: string
  icon?: string
}>()
</script>
