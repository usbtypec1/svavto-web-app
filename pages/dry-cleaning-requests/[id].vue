<template>
  <div>
    <PageHeader text="Запрос на химчистку" />
    <CarToWashAdditionalServicesForm
      :service-id-to-count="serviceIdToCount"
      :specific-car-wash-services="servicesToReview"
    />
    <div class="flex justify-between gap-2 my-2">
      <Button
        @click="resetServiceIdToCount"
        label="Выбрать все"
        severity="success"
        outlined
        class="basis-1/2"
        icon="pi pi-check"
      />
      <Button
        @click="clearServiceIdToCount"
        label="Убрать все"
        severity="danger"
        outlined
        class="basis-1/2"
        icon="pi pi-times"
      />
    </div>
    <div class="my-6 flex flex-col gap-y-2">
      <div class="flex items-center gap-2">
        <Checkbox v-model="withComment" binary input-id="comment" />
        <label for="comment">Добавить комментарий</label>
      </div>
      <div v-auto-animate>
        <Textarea v-if="withComment" v-model="comment" fluid rows="5" />
      </div>
    </div>
    <div class="flex flex-col gap-y-2">
      <Button
        @click="onReject"
        label="Отклонить"
        severity="danger"
        fluid
        icon="pi pi-times"
      />
      <Button
        @click="onApprove"
        label="Одобрить"
        :disabled="!canBeApproved"
        fluid
        icon="pi pi-check"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebApp, useWebAppHapticFeedback, useWebAppPopup } from "vue-tg"
import CarToWashAdditionalServicesForm from "~/components/cars-to-wash/forms/CarToWashAdditionalServicesForm.vue"
import {
  DryCleaningRequestStatus,
  type DryCleaningRequest,
} from "~/types/dry-cleaning-requests"

const { sendData } = useWebApp()
const { notificationOccurred } = useWebAppHapticFeedback()
const { showConfirm } = useWebAppPopup()

const route = useRoute()
const dryCleaningRequestId = Number(route.params.id as string)

const withComment = ref<boolean>(false)
const comment = ref<string | null>(null)

const runtimeConfig = useRuntimeConfig()
const { data: dryCleaningRequest } = await useFetch<DryCleaningRequest>(
  `/shifts/dry-cleaning-requests/${dryCleaningRequestId}/`,
  {
    baseURL: runtimeConfig.public.apiBaseUrl,
  },
)

watchEffect(async () => {
  if (
    dryCleaningRequest.value?.status === DryCleaningRequestStatus.Accepted ||
    dryCleaningRequest.value?.status === DryCleaningRequestStatus.Rejected
  ) {
    notificationOccurred("error")
    await navigateTo({ name: "dry-cleaning-requests-already-responded" })
  }
})

const servicesToReview = computed(() => {
  if (!dryCleaningRequest.value) return []
  return dryCleaningRequest.value.services.map((service) => ({
    ...service,
    parent: null,
  }))
})

const {
  canBeApproved,
  resetServiceIdToCount,
  clearServiceIdToCount,
  serviceIdToCount,
  services,
} = useDryCleaningRequestReview(dryCleaningRequest)

const onApprove = (): void => {
  notificationOccurred("warning")
  showConfirm(
    "Вы уверены что хотите одобрить запрос на химчистку?",
    (ok: boolean): void => {
      if (!ok) return
      notificationOccurred("success")
      sendData(
        JSON.stringify({
          dry_cleaning_request_id: dryCleaningRequest.value!.id,
          is_approved: true,
        }),
      )
    },
  )
}

const onReject = (): void => {
  notificationOccurred("warning")
  showConfirm(
    "❗️ Вы уверены что хотите отклонить запрос на химчистку?",
    (ok: boolean): void => {
      if (!ok) return
      notificationOccurred("success")
      sendData(
        JSON.stringify({
          dry_cleaning_request_id: dryCleaningRequest.value!.id,
          is_approved: false,
          comment: withComment.value ? comment.value : null,
          services: services.value,
        }),
      )
    },
  )
}
</script>
