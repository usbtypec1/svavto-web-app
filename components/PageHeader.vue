<template>
  <h1 class="text-xl font-semibold mb-2">{{ text }}</h1>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
