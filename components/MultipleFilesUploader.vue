<template>
  <div>
    <p v-if="label" class="font-semibold">{{ label }}</p>
    <div
      v-for="photoUrl in uploadedPhotoUrls"
      :key="photoUrl"
      class="flex flex-col gap-y-4 mb-4"
    >
      <div class="flex flex-col gap-y-2">
        <NuxtImg
          class="basis-9/10"
          :src="photoUrl"
          alt="Uploaded photo"
          placeholder
        />
        <Button
          @click="onDeleteUploadedPhoto(photoUrl)"
          icon="pi pi-trash"
          severity="danger"
          label="Удалить фото"
          outlined
          fluid
          class="basis-1/10"
        />
      </div>
    </div>
    <FileUpload
      name="photo"
      :url="photoUploadUrl"
      accept="image/*"
      mode="basic"
      auto
      invalid-file-limit-message="Максимальное количество файлов 10"
      :max-file-size="1_000_000"
      invalid-file-size-message="Максимальный размер файла 1 МБ"
      :file-limit="10"
      choose-label="Добавить фото"
      @error="onFileUploadError"
      @upload="onFileUploadSuccess"
      class="w-full"
    >
      <template #empty>
        <span>Вы можете загрузить фото штрафа</span>
      </template>
    </FileUpload>
  </div>
</template>

<script setup lang="ts">
import type { FileUploadUploadEvent } from "primevue"
import { useWebAppHapticFeedback, useWebAppPopup } from "vue-tg"

defineProps<{
  label?: string
}>()

const { notificationOccurred } = useWebAppHapticFeedback()
const { showAlert } = useWebAppPopup()

const uploadedPhotoUrls = defineModel<string[]>("uploadedPhotoUrls", {
  default: () => [],
})

const runtimeConfig = useRuntimeConfig()
const photoUploadUrl = `${runtimeConfig.public.apiBaseUrl}/photo-upload/`

const onFileUploadSuccess = (event: FileUploadUploadEvent): void => {
  const url = JSON.parse(event.xhr.response).url
  uploadedPhotoUrls.value.push(url)
  notificationOccurred("success")
  showAlert("Фото загружено")
}

const onFileUploadError = (): void => {
  notificationOccurred("error")
  showAlert("Не удалось загрузить изображение")
}

const onDeleteUploadedPhoto = (url: string): void => {
  uploadedPhotoUrls.value = uploadedPhotoUrls.value.filter(
    (photoUrl: string): boolean => photoUrl !== url,
  )
  notificationOccurred("success")
  showAlert("Фото удалено")
}
</script>
