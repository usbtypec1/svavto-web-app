<template>
  <div>
    <PenaltyList v-if="status ==='success'" :penalties="penalties!"/>
    <ScrollTop />
    <MainButton @click="close" text="Закрыть"/>
  </div>
</template>

<script setup lang="ts">
import type { Penalty } from '~/types/penalties'
import PenaltyList from '~/components/PenaltyList.vue'
import { MainButton, useWebApp} from 'vue-tg'

const { close }= useWebApp()

const { params } = useRoute()
const staffId = Number(params.staffId as string)

const runtimeConfig = useRuntimeConfig()

const { data: penalties, status } = await useFetch('/economics/penalties/', {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: {
    staff_ids: [staffId],
    limit: 1000,
  },
  transform: (data: { penalties: Penalty[] }): Penalty[] => data.penalties,
})
</script>
