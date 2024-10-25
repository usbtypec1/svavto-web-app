<template>
  <div>
    <ReplyMarkupBuilder/>
    <MainButton @click="onSubmit"/>
  </div>
</template>

<script setup lang="ts">
import ReplyMarkupBuilder from '~/components/forms/ReplyMarkupBuilder.vue'
import { MainButton, useWebApp } from 'vue-tg'

const { sendData } = useWebApp()

const onSubmit = () => {
  sendData?.(JSON.stringify({ hello: 'world' }))
}

interface Button {
  text: string
  url: string
}

type ButtonsRow = Button[]
type ButtonsRows = ButtonsRow[]
</script>
