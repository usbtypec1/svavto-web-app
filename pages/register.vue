<template>
  <div>
    <Fieldset legend="Регистрация">
      <form @submit.prevent class="flex flex-col gap-y-4">
        <div class="flex flex-col gap-y-2">
          <label class="font-semibold">ФИО</label>
          <InputText v-model.trim="fullName"/>
        </div>
        <div class="flex flex-col gap-y-2">
          <label>Номер телефона, привязанный к аккаунту в каршеринге</label>
          <InputText v-model.trim="carSharingPhoneNumber"/>
        </div>
        <div class="flex flex-col gap-y-2">
          <label>Номер телефона, указанный в компании Консоль</label>
          <InputText v-model.trim="consolePhoneNumber"/>
        </div>
      </form>
    </Fieldset>
    <MainButton
      @click="onConfirm"
      text="Зарегистрироваться"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp, useWebAppPopup } from 'vue-tg'

const { showAlert } = useWebAppPopup()
const { sendData } = useWebApp()

const fullName = ref<string>('')
const carSharingPhoneNumber = ref<string>('')
const consolePhoneNumber = ref<string>('')

const isAllFieldsFilled = computed((): boolean => {
  return (
    fullName.value.length > 0
    && carSharingPhoneNumber.value.length > 0
    && consolePhoneNumber.value.length > 0
  )
})

const serializedData = computed((): string => {
  return JSON.stringify({
    full_name: fullName.value,
    car_sharing_phone_number: carSharingPhoneNumber.value,
    console_phone_number: consolePhoneNumber.value,
  })
})

const onConfirm = (): void => {
  if (isAllFieldsFilled.value) {
    sendData?.(serializedData.value)
  } else {
    showAlert?.('Вы должны заполнить все поля')
  }
}
</script>
