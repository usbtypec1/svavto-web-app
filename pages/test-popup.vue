<template>
  <div>
    <Textarea v-model="text" />
    <p>Длина: {{ text.length }}</p>
    <Button label="Показать" @click="showAlert(text)" />
  </div>
</template>

<script setup lang="ts">
import { useWebAppPopup } from "vue-tg"

const text = ref<string>("")

const { showAlert } = useWebAppPopup()
</script>
