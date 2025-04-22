<template>
  <Form
    :resolver
    class="flex flex-col gap-4 w-full"
    :validate-on-value-update="false"
    :validate-on-blur="false"
    :validate-on-mount="false"
    :validate-on-submit="true"
    @submit="onSubmitForm"
    v-slot="$form"
  >
    <FormField v-slot="$field" name="amount" class="flex flex-col gap-1">
      <label class="font-semibold" for="surcharge_amount"> Сумма </label>
      <InputNumber
        input-id="surcharge_amount"
        :use-grouping="false"
        :min="1"
        :max="1_000_000"
        type="text"
      />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error?.message }}</Message
      >
    </FormField>

    <FormField v-slot="$field" name="date" class="flex flex-col gap-3">
      <label class="font-semibold" for="surcharge_date"> Дата </label>
      <div class="flex flex-col gap-y-4">
        <FloatLabel variant="on">
          <DatePicker view="month" date-format="MM - yy год" fluid />
          <label for="month">Месяц</label>
        </FloatLabel>
        <FloatLabel variant="on" v-if="$field.value">
          <DatePicker
            :model-value="$field.value"
            :min-date="startOfMonth($field.value)"
            :max-date="endOfMonth($field.value)"
            fluid
          />
          <label for="date">Дата</label>
        </FloatLabel>
      </div>
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error.message }}
      </Message>
    </FormField>

    <FormField v-slot="$field" name="reason">
      <p class="font-semibold">Причина</p>
      <InputText fluid class="mt-2" />
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error.message }}</Message
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
import type { FormSubmitEvent } from "@primevue/forms"
import { Form } from "@primevue/forms"
import { z } from "zod"
import { zodResolver } from "@primevue/forms/resolvers/zod"
import type { CarTransporterSurchargeCreateEvent } from "~/types/surcharges"
import { startOfMonth, endOfMonth } from "date-fns"

const props = defineProps<{
  staffId: number
}>()

const emit = defineEmits<{
  submit: [data: CarTransporterSurchargeCreateEvent]
}>()

const resolver = ref(
  zodResolver(
    z.object({
      amount: z
        .number({ message: "Введите сумму доплаты" })
        .min(1, { message: "Минимальная сумма доплаты 1" })
        .max(1_000_000, { message: "Максимальная сумма доплаты 1 000 000" }),
      reason: z
        .string({ message: "Введите причину доплаты" })
        .min(1, { message: "Минимальная длина 1 символ" })
        .max(1000, { message: "Максимальная длина 1000 символов" }),
      date: z.date({ message: "Введите дату доплаты" }),
    }),
  ),
)

const onSubmitForm = ({ valid, values }: FormSubmitEvent): void => {
  if (valid) {
    values.staffId = props.staffId
    emit("submit", values as CarTransporterSurchargeCreateEvent)
  }
}
</script>
