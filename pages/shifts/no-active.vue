<template>
  <div>
    <Message
      icon="pi pi-exclamation-triangle"
      severity="warn"
    >
      У вас нет активной смены
    </Message>
    <MainButton text="Закрыть"/>
  </div>
</template>

<script setup lang="ts">
import { MainButton } from 'vue-tg'
</script>
