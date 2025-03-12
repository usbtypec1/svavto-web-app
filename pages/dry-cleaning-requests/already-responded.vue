<template>
  <div>
    <Message severity="secondary" icon="pi pi-info-circle">
      Запрос на химчистку уже был обработан
    </Message>
    <MainButton @click="close" text="Закрыть" />
  </div>
</template>

<script setup lang="ts">
import { useWebApp, MainButton } from "vue-tg"

const { close } = useWebApp()
</script>
