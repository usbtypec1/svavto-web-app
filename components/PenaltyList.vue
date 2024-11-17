<template>
  <div
    v-if="penalties.length > 0"
    class="flex flex-col gap-y-4"
  >
    <PenaltyListItem
      v-for="penalty in penalties"
      :key="penalty.id"
      :penalty="penalty"
    />
  </div>
  <Message
    v-if="penalties.length === 0"
  >

  </Message>
</template>

<script setup lang="ts">
import type { Penalty } from '~/types/penalties'

defineProps<{
  penalties: Penalty[],
}>()
</script>
