<template>
  <div class="flex flex-col gap-y-2">
    <h1 v-if="staffStatus === 'success'" class="text-xl font-bold">
      Доплаты сотрудника {{ staff!.full_name }}
    </h1>
    <SurchargeList v-if="status === 'success'" :surcharges="surcharges!" />
    <Message v-else-if="status === 'error'" severity="error"
      >Произошла ошибка</Message
    >
    <ScrollTop />
    <MainButton @click="close" text="Закрыть" />
  </div>
</template>

<script setup lang="ts">
import type { Surcharge } from "~/types/surcharges"
import { MainButton, useWebApp } from "vue-tg"
import type { Staff } from "~/types/staff"

const { close } = useWebApp()

const { params } = useRoute()

const staffId = Number(params.staffId as string)

const runtimeConfig = useRuntimeConfig()

const { data: staff, status: staffStatus } = await useFetch<Staff>(
  `/staff/${staffId}/`,
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
  },
)

const { data: surcharges, status } = await useFetch("/economics/surcharges/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  query: {
    staff_ids: [staffId],
    limit: 1000,
  },
  transform(data: { surcharges: Surcharge[] }): Surcharge[] {
    return data.surcharges
  },
})
</script>
