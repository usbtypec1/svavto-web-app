<template>
  <div>
    <ReplyMarkupBuilder
      v-model:buttons="buttons"
    />
    <MainButton
      @click="onSubmit"
      text="Сохранить"
      :visible="!anyButtonError && anyButton"
    />
  </div>
</template>

<script setup lang="ts">
import ReplyMarkupBuilder from '~/components/forms/ReplyMarkupBuilder.vue'
import { MainButton, useWebApp } from 'vue-tg'
import type { Button } from '~/reply-markup'

const { sendData } = useWebApp()
const buttons = ref<Button[]>([])

const anyButton = computed((): boolean => buttons.value.length > 0)
const anyButtonError = computed((): boolean => {
  return buttons.value.map(({ textErrors, urlErrors }) => textErrors.length > 0 || urlErrors.length > 0)
    .reduce((anyErrors, isError) => anyErrors || isError, false)
})

const serializedButtons = computed((): string => {
  return JSON.stringify(buttons.value.map(({ text, url }) => ({ text, url })))
})

const onSubmit = () => {
  sendData?.(serializedButtons.value)
}
</script>
