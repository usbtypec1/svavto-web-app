<template>
  <div class="flex flex-col gap-y-3">
    <RegisterRequestList
      v-if="status === 'success'"
      :staff-register-requests="staffRegisterRequests!"
      @accept="onAcceptRegisterRequest"
      @reject="onRejectRegisterRequest"
    />
    <Message v-else icon="pi pi-exclamation-triangle" severity="error">
      Ошибка при загрузке заявок на регистрацию
    </Message>
    <MainButton text="Закрыть" @click="close" />
  </div>
</template>

<script setup lang="ts">
import type { StaffRegisterRequest } from "~/types/staff-register-requests"
import {
  useWebAppHapticFeedback,
  useWebAppPopup,
  MainButton,
  useWebApp,
} from "vue-tg"

const { close } = useWebApp()
const { notificationOccurred } = useWebAppHapticFeedback()
const { showConfirm, showAlert } = useWebAppPopup()

const runtimeConfig = useRuntimeConfig()

const {
  data: staffRegisterRequests,
  refresh,
  status,
} = await useFetch("/staff/register-requests/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform(data: {
    staff_register_requests: StaffRegisterRequest[]
  }): StaffRegisterRequest[] {
    return data.staff_register_requests
  },
})

useIntervalFn(refresh, 10_000)

const acceptRegisterRequest = async (
  registerRequestId: number,
): Promise<void> => {
  await $fetch("/staff/register-requests/accept/", {
    method: "POST",
    body: JSON.stringify({ staff_register_request_id: registerRequestId }),
    baseURL: runtimeConfig.public.apiBaseUrl,
    onRequestError(error) {
      showAlert("❗️ Ошибка при принятии заявки")
      notificationOccurred("error")
    },
    async onResponse(response) {
      showAlert("❗️ Заявка принята")
      notificationOccurred("success")
      await refresh()
    },
  })
}

const onAcceptRegisterRequest = (registerRequestId: number): void => {
  showConfirm(
    "Вы уверены, что хотите принять заявку?",
    async (ok: boolean) => {
      if (!ok) return
      await acceptRegisterRequest(registerRequestId)
    },
  )
}

const rejectRegisterRequest = async (
  registerRequestId: number,
): Promise<void> => {
  await $fetch("/staff/register-requests/reject/", {
    method: "POST",
    body: JSON.stringify({ staff_register_request_id: registerRequestId }),
    baseURL: runtimeConfig.public.apiBaseUrl,
    onRequestError(error) {
      showAlert("❗️ Ошибка при отклонении заявки")
      notificationOccurred("error")
    },
    async onResponse(response) {
      showAlert("❗️ Заявка отклонена")
      notificationOccurred("success")
      await refresh()
    },
  })
}

const onRejectRegisterRequest = (registerRequestId: number): void => {
  showConfirm(
    "Вы уверены, что хотите отклонить заявку?",
    async (ok: boolean) => {
      if (!ok) return
      await rejectRegisterRequest(registerRequestId)
    },
  )
}
</script>
