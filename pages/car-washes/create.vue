<template>
  <div>
    <Fieldset legend="Добавить новую мойку">
      <CarWashForm :is-loading="isLoading" @submit="onCreateCarWash" />
    </Fieldset>
    <FloatingCornerButton page-name="car-washes" severity="primary" />
  </div>
</template>

<script setup lang="ts">
import type { CarWashFormValues } from "~/types/car-washes"
import { FetchError } from "ofetch"
import { useWebAppPopup } from "vue-tg"

const { showAlert } = useWebAppPopup()

const isLoading = ref<boolean>(false)

const runtimeConfig = useRuntimeConfig()

const onCreateCarWash = async (values: CarWashFormValues): Promise<void> => {
  console.log("Creating car wash:", values)
  isLoading.value = true
  try {
    const responseData = await $fetch("/car-washes/", {
      baseURL: runtimeConfig.public.apiBaseUrl,
      method: "POST",
      body: values,
    })
    showAlert("Мойка успешно создана")
    await navigateTo({ name: "car-washes" })
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      const errorCodes = getErrorCodes(error.data)
      if (errorCodes.includes("car_wash_already_exists")) {
        showAlert("Мойка с таким названием уже существует")
      }
    }
    throw error
  } finally {
    isLoading.value = false
  }
}
</script>
