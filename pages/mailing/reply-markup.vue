<template>
  <div>
    <ReplyMarkupBuilder
      v-model:buttons="buttons"
    />
    <MainButton
      @click="onSubmit"
      text="Сохранить"
    />
  </div>
</template>

<script setup lang="ts">
import ReplyMarkupBuilder from '~/components/forms/ReplyMarkupBuilder.vue'
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'
import type { Button } from '~/reply-markup'

const { showAlert } = useWebAppPopup()
const { sendData } = useWebApp()
const buttons = ref<Button[]>([])

const anyButton = computed((): boolean => buttons.value.length > 0)

const onSubmit = () => {
  if (!anyButton.value) {
    showAlert?.('Добавьте хотя бы одну кнопку')
  } else {
    sendData?.(JSON.stringify({ event: 'attach_reply_markup', buttons: buttons.value }))
  }
}


</script>
