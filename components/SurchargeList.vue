<template>
    <div
      v-if="surcharges.length > 0"
      class="flex flex-col gap-y-4"
    >
      <SurchargeListItem
        v-for="surcharge in surcharges"
        :key="surcharge.id"
        :surcharge="surcharge"
      />
    </div>
    <Message
      v-if="surcharges.length === 0"
      severity="warn"
    >
      <p>😐 Нет доплат</p>
    </Message>
  </template>
  
  <script setup lang="ts">
  import type { CarTransporterSurcharge } from '~/types/surcharges'
  
  defineProps<{
    surcharges: CarTransporterSurcharge[],
  }>()
  </script>
  
  