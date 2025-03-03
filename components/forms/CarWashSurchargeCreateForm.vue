<template>
  <Form
    :resolver
    class="flex flex-col gap-4 w-full"
    :validate-on-value-update="false"
    :validate-on-blur="true"
    @submit="onSubmitForm"
    v-slot="$form"
  >
    <FormField v-slot="$field" name="amount" class="flex flex-col gap-1">
      <label class="font-semibold" for="penalty_amount">Сумма</label>
      <InputNumber input-id="penalty_amount" type="text" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error?.message }}</Message
      >
    </FormField>

    <FormField v-slot="$field" name="date" class="flex flex-col gap-1">
      <label class="font-semibold" for="penalty_date">Дата</label>
      <DatePicker input-id="penalty_date" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error?.message }}</Message
      >
    </FormField>

    <FormField v-slot="$field" name="reason" class="flex flex-col gap-1">
      <label class="font-semibold" for="penalty_reason">Причина</label>
      <Textarea input-id="penalty_reason" rows="5" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error?.message }}</Message
      >
    </FormField>
    <Button
      :disabled="!$form.valid"
      type="submit"
      severity="success"
      label="Подтвердить"
    />
  </Form>
</template>

<script setup lang="ts">
import type { CarWashSurchargeCreateEvent } from "~/types/surcharges"
import type { FormSubmitEvent } from "@primevue/forms"
import { Form } from "@primevue/forms"
import { z } from "zod"
import { zodResolver } from "@primevue/forms/resolvers/zod"

const emit = defineEmits<{
  submit: [data: CarWashSurchargeCreateEvent]
}>()

const resolver = ref(
  zodResolver(
    z.object({
      amount: z
        .number({ message: "Введите сумму доплаты" })
        .min(1, { message: "Минимальная сумма доплаты 1" })
        .max(1_000_000, { message: "Максимальная сумма доплаты 1 000 000" }),
      date: z.date({ message: "Введите дату доплаты" }),
      reason: z
        .string({ message: "Введите причину доплаты" })
        .min(1, { message: "Минимальная длина 1 символ" })
        .max(1000, { message: "Максимальная длина 1000 символов" }),
    }),
  ),
)

const onSubmitForm = ({ valid, values }: FormSubmitEvent): void => {
  if (valid) {
    emit("submit", values as CarWashSurchargeCreateEvent)
  }
}
</script>
