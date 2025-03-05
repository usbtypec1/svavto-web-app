<template>
  <div>
    <Message icon="pi pi-exclamation-triangle" severity="warn">
      У вас нет активной смены
    </Message>
    <MainButton text="Закрыть" @click="close" />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp } from "vue-tg"

const { close } = useWebApp()
</script>
