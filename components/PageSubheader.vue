<template>
  <h3 class="text-lg font-normal mb-2">{{ text }}</h3>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
