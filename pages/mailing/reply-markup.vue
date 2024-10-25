<template>
  <div>
    <ReplyMarkupBuilder
      v-model:buttons="buttons"
    />
    <MainButton @click="onSubmit"/>
  </div>
</template>

<script setup lang="ts">
import ReplyMarkupBuilder from '~/components/forms/ReplyMarkupBuilder.vue'
import { MainButton, useWebApp } from 'vue-tg'
import type { Button } from '~/reply-markup'

const buttons = ref<Button[]>([])

const { sendData } = useWebApp()

const onSubmit = () => {
  sendData?.(JSON.stringify(buttons))
}

</script>
