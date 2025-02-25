<template>
  <div>
    <p v-if="label" class="font-semibold">{{ label }}</p>
    <FileUpload
      v-if="fileUploadStatus === 'idle'"
      name="photo"
      :url="photoUploadUrl"
      accept="image/*"
      mode="basic"
      auto
      invalid-file-limit-message="Максимальное количество файлов 1"
      :max-file-size="1_000_000"
      invalid-file-size-message="Максимальный размер файла 1 МБ"
      :file-limit="1"
      choose-label="Выбрать фото"
      @error="onFileUploadError"
      @upload="onFileUploadSuccess"
      class="w-full"
    >
      <template #empty>
        <span>Вы можете загрузить фото штрафа</span>
      </template>
    </FileUpload>
    <Message
      v-else-if="fileUploadStatus === 'error'"
      severity="danger"
      icon="pi pi-exclamation-triangle"
    >
      Ошибка при загрузке фото
    </Message>
    <template v-else-if="fileUploadStatus === 'success'">
      <NuxtImg :src="uploadedPhotoUrl" class="w-full" />
      <Button
        @click="onDeleteUploadedPhoto"
        label="Удалить фото"
        icon="pi pi-trash"
        severity="danger"
        outlined
        fluid
        class="my-2"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { FileUploadUploadEvent, FileUploadErrorEvent } from "primevue"

defineProps<{
  label?: string
}>()

const uploadedPhotoUrl = defineModel<string>("uploadedPhotoUrl")

type FileUploadStatus = "success" | "error" | "idle"

const fileUploadStatus = ref<FileUploadStatus>("idle")

const runtimeConfig = useRuntimeConfig()
const photoUploadUrl = `${runtimeConfig.public.apiBaseUrl}/photo-upload/`

const onFileUploadSuccess = (event: FileUploadUploadEvent): void => {
  fileUploadStatus.value = "success"
  uploadedPhotoUrl.value = JSON.parse(event.xhr.response).url
}

const onFileUploadError = (event: FileUploadErrorEvent): void => {
  fileUploadStatus.value = "error"
}

const onDeleteUploadedPhoto = (): void => {
  fileUploadStatus.value = "idle"
  uploadedPhotoUrl.value = undefined
}
</script>
