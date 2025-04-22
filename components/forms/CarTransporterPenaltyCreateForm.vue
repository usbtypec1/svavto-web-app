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
      <label class="font-semibold" for="penalty_amount"> Сумма </label>
      <InputNumber
        input-id="penalty_amount"
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
      <RadioButtonGroup class="flex flex-col gap-y-2">
        <div v-for="reason in reasons" class="flex gap-x-1 items-center">
          <RadioButton :input-id="reason" :value="reason" />
          <label :for="reason">{{ reason }}</label>
        </div>
        <div class="flex gap-x-1 items-center">
          <RadioButton input-id="other_reason" value="other_reason" />
          <label for="other_reason">Другая причина</label>
        </div>
      </RadioButtonGroup>
      <div v-if="!reasons.includes($field.value) && $field.value !== undefined">
        <InputText fluid class="mt-2" />
        <Message severity="secondary" variant="simple" size="small">
          Введите причину
        </Message>
      </div>
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error.message }}</Message
      >
    </FormField>

    <MultipleFilesUploader
      v-model:uploaded-photo-urls="uploadedPhotoUrls"
      label="Фото штрафа"
    />

    <Button
      :disabled="!$form.valid"
      type="submit"
      severity="danger"
      label="Подтвердить"
    />
  </Form>
</template>

<script setup lang="ts">
import type { CarTransporterPenaltyCreateEvent } from "~/types/penalties"
import type { FormSubmitEvent } from "@primevue/forms"
import { Form } from "@primevue/forms"
import { z } from "zod"
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { startOfMonth, endOfMonth } from "date-fns"

const props = defineProps<{
  staffId: number
}>()

const emit = defineEmits<{
  submit: [data: CarTransporterPenaltyCreateEvent]
}>()

const resolver = ref(
  zodResolver(
    z.object({
      amount: z
        .number({ message: "Введите сумму штрафа" })
        .min(1, { message: "Минимальная сумма штрафа 1" })
        .max(1_000_000, { message: "Максимальная сумма штрафа 1 000 000" }),
      reason: z
        .string({ message: "Введите причину штрафа" })
        .min(1, { message: "Минимальная длина 1 символ" })
        .max(1000, { message: "Максимальная длина 1000 символов" }),
      date: z.date({ message: "Введите дату штрафа" }),
    }),
  ),
)

const uploadedPhotoUrls = ref<string[]>([])

const reasons: string[] = ["Невыход", "Ранний уход", "Отчет не вовремя"]

const onSubmitForm = ({ valid, values }: FormSubmitEvent): void => {
  if (valid) {
    emit("submit", {
      ...values,
      staffId: props.staffId,
      photoUrls: uploadedPhotoUrls.value,
    } as CarTransporterPenaltyCreateEvent)
  }
}
</script>
