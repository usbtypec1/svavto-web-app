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
          <InputMask
            id="carSharingPhoneNumber"
            type="text"
            placeholder="+7 (351) 240-04-40"
            inputmode="tel"
            mask="+9 (999) 999-99-99"
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
          <InputMask
            id="consolePhoneNumber"
            type="text"
            placeholder="+7 (351) 240-04-40"
            inputmode="tel"
            mask="+9 (999) 999-99-99"
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
        <FormField v-slot="$field" name="staffType">
          <RadioButtonGroup class="flex flex-col gap-y-1.5">
            <label for="staffType" class="font-semibold">Специализация</label>
            <div
              v-for="{ label, value } in options"
              class="flex items-center gap-x-1"
            >
              <RadioButton :input-id="label" :value="value" fluid />
              <label :for="label">{{ label }}</label>
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
import { StaffType } from "~/types/staff"

const { notificationOccurred } = useWebAppHapticFeedback()
const { sendData } = useWebApp()

const options = [
  { label: "Перегонщик", value: StaffType.CAR_TRANSPORTER },
  { label: "Перегонщик-мойщик", value: StaffType.CAR_TRANSPORTER_AND_WASHER },
]

const resolver = ref(
  zodResolver(
    z.object({
      fullName: z
        .string()
        .min(5, { message: "Минимальная длина ФИО - 5 символов" })
        .max(64, { message: "Максимальная длина ФИО - 64 символов" }),
      carSharingPhoneNumber: z
        .string()
        .min(1, { message: "Введите номер телефона" }),
      consolePhoneNumber: z
        .string()
        .min(1, { message: "Введите номер телефона" }),
      staffType: z.nativeEnum(StaffType),
    }),
  ),
)

const initialValues = ref({
  fullName: "",
  carSharingPhoneNumber: "",
  consolePhoneNumber: "",
  staffType: StaffType.CAR_TRANSPORTER,
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
      staff_type: values.staffType,
    }),
  )
}
</script>
