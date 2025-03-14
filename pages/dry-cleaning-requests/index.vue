<template>
  <div>
    <DryCleaningRequestListDataView
      :requests="dryCleaningRequests!"
      @open-request="onOpenRequest"
    />
    <MainButton @click="close" text="Закрыть" />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp } from "vue-tg"
import DryCleaningRequestListDataView from "~/components/data-views/DryCleaningRequestListDataView.vue"
import {
  DryCleaningRequestStatus,
  type DryCleaningRequest,
} from "~/types/dry-cleaning-requests"

const { close, sendData } = useWebApp()

const runtimeConfig = useRuntimeConfig()
const { data: dryCleaningRequests, refresh } = await useFetch(
  "/dry-cleaning/requests/",
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
    query: { statuses: [DryCleaningRequestStatus.Pending] },
    transform(data: {
      dry_cleaning_requests: DryCleaningRequest[]
    }): DryCleaningRequest[] {
      return data.dry_cleaning_requests
    },
  },
)

useIntervalFn(refresh, 10_000)

const onOpenRequest = (dry_cleaning_request_id: number): void => {
  sendData(JSON.stringify({ dry_cleaning_request_id }))
}
</script>
