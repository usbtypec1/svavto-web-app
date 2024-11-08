<template>
  <div>
    <Fieldset legend="Регистрация">
      <Form
        v-slot="$form"
        :initialValues
        :resolver
        class="flex flex-col gap-y-4"
        @submit="onFormSubmit"
      >
        <div class="flex flex-col gap-1">
          <label for="fullName">ФИО</label>
          <InputText id="fullName" name="fullName" type="text" placeholder="Пупкин Василий Иванович" fluid/>
          <Message v-if="$form.fullName?.invalid" severity="error" size="small" variant="simple">
            {{ $form.fullName.error?.message }}
          </Message>
        </div>
        <div class="flex flex-col gap-1">
          <label for="carSharingPhoneNumber">Номер телефона, привязанный к аккаунту в каршеринге</label>
          <InputMask
            id="carSharingPhoneNumber"
            name="carSharingPhoneNumber"
            mask="+7 (999) 999-99-99"
            placeholder="+7 (351) 240-04-40"
            fluid
            inputmode="tel"
          />
          <Message v-if="$form.carSharingPhoneNumber?.invalid" severity="error" size="small" variant="simple">
            {{ $form.carSharingPhoneNumber.error?.message }}
          </Message>
        </div>
        <div class="flex flex-col gap-1">
          <label for="consolePhoneNumber">Номер телефона, указанный в компании Консоль</label>
          <InputMask
            id="consolePhoneNumber"
            name="consolePhoneNumber"
            mask="+7 (999) 999-99-99"
            placeholder="+7 (351) 240-04-40"
            inputmode="tel"
            fluid
          />
          <Message v-if="$form.consolePhoneNumber?.invalid" severity="error" size="small" variant="simple">
            {{ $form.consolePhoneNumber.error?.message }}
          </Message>
        </div>
        <Button
          type="submit"
          label="Зарегистрироваться"
          :disabled="!$form.valid"
          :raised="$form.valid"
        />
      </Form>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod';
import { useWebApp, useWebAppHapticFeedback } from 'vue-tg'

const { notificationOccurred } = useWebAppHapticFeedback()
const { sendData } = useWebApp()

const phoneNumberRegExp = new RegExp('^\\+7\\s\\(\\d{3}\\)\\s\\d{3}-\\d{2}-\\d{2}$')

const resolver = ref(zodResolver(
  z.object({
    fullName: z.string()
      .min(5, { message: 'Минимальная длина ФИО - 5 символов' })
      .max(64, { message: 'Максимальная длина ФИО - 64 символов' }),
    carSharingPhoneNumber: z.string()
      .min(1, { message: 'Введите номер телефона' })
      .regex(phoneNumberRegExp, { message: 'Неверный формат номера телефона' }),
    consolePhoneNumber: z.string()
      .min(1, { message: 'Введите номер телефона' })
      .regex(phoneNumberRegExp, { message: 'Неверный формат номера телефона' }),
  }),
))

const initialValues = ref({
  fullName: '',
  carSharingPhoneNumber: '',
  consolePhoneNumber: '',
});

const onFormSubmit = ({ valid, values }) => {
  console.log(`Register form submit: isValid=${valid} values=${JSON.stringify(values)}`)
  if (!valid) return
  notificationOccurred?.('success')
  sendData?.(JSON.stringify({
    full_name: values.fullName,
    car_sharing_phone_number: values.carSharingPhoneNumber,
    console_phone_number: values.consolePhoneNumber,
  }))
}
</script>
