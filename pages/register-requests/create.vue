<template>
  <div>
    <Fieldset legend="Регистрация">
      <Form
        :initialValues
        :resolver
        class="flex flex-col gap-y-4"
        @submit="onFormSubmit"
        :validate-on-blur="false"
        :validate-on-submit="true"
        :validate-on-value-update="false"
        :validate-on-mount="false"
      >
        <FormField v-slot="$field" name="fullName">
          <label for="fullName">ФИО</label>
          <InputText
            id="fullName"
            type="text"
            placeholder="Пупкин Василий Иванович"
            fluid
          />
          <Message
            v-if="$field.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="carSharingPhoneNumber">
          <label for="carSharingPhoneNumber"
            >Номер телефона, привязанный к аккаунту в каршеринге</label
          >
          <InputText
            id="carSharingPhoneNumber"
            type="text"
            placeholder="+7 (351) 240-04-40"
            inputmode="tel"
            fluid
          />
          <Message
            v-if="$field.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="consolePhoneNumber">
          <label for="consolePhoneNumber"
            >Номер телефона, привязанный к аккаунту в каршеринге</label
          >
          <InputText
            id="consolePhoneNumber"
            type="text"
            placeholder="+7 (351) 240-04-40"
            inputmode="tel"
            fluid
          />
          <Message
            v-if="$field.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <FormField v-slot="$field" name="staffType" :initial-value="options[0].value">
          <RadioButtonGroup class="flex flex-col gap-y-1.5">
            <label for="staffType" class="font-semibold">Тип сотрудника</label>
            <div
              v-for="{ label, value } in options"
              class="flex items-center gap-x-1"
            >
              <RadioButton :input-id="value" :value="value" fluid />
              <label :for="value">{{ label }}</label>
            </div>
          </RadioButtonGroup>
          <Message
            v-if="$field.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field.error?.message }}
          </Message>
        </FormField>
        <Button type="submit" label="Зарегистрироваться" />
      </Form>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms"
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { z } from "zod"
import { useWebApp, useWebAppHapticFeedback } from "vue-tg"

const { notificationOccurred } = useWebAppHapticFeedback()
const { sendData } = useWebApp()

const options = [
  { label: "Перегонщик", value: "car_transporter" },
  { label: "Перегонщик-мойщик", value: "car_transporter_and_washer" },
]

const phoneNumberRegExp = new RegExp(
  "^\\+7\\s\\(\\d{3}\\)\\s\\d{3}-\\d{2}-\\d{2}$",
)

const resolver = ref(
  zodResolver(
    z.object({
      fullName: z
        .string()
        .min(5, { message: "Минимальная длина ФИО - 5 символов" })
        .max(64, { message: "Максимальная длина ФИО - 64 символов" }),
      carSharingPhoneNumber: z
        .string()
        .min(1, { message: "Введите номер телефона" })
        .regex(phoneNumberRegExp, {
          message: "Неверный формат номера телефона",
        }),
      consolePhoneNumber: z
        .string()
        .min(1, { message: "Введите номер телефона" })
        .regex(phoneNumberRegExp, {
          message: "Неверный формат номера телефона",
        }),
      stafftype: z.enum(["car_transporter", "car_transporter_and_washer"]),
    }),
  ),
)

const initialValues = ref({
  fullName: "",
  carSharingPhoneNumber: "",
  consolePhoneNumber: "",
})

const onFormSubmit = ({ valid, values }: FormSubmitEvent) => {
  console.log(
    `Register form submit: isValid=${valid} values=${JSON.stringify(values)}`,
  )
  if (!valid) return
  notificationOccurred?.("success")
  sendData?.(
    JSON.stringify({
      full_name: values.fullName,
      car_sharing_phone_number: values.carSharingPhoneNumber,
      console_phone_number: values.consolePhoneNumber,
    }),
  )
}
</script>
