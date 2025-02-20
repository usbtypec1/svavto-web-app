<template>
  <Form
    :resolver
    class="flex flex-col gap-4 w-full"
    :validate-on-value-update="true"
    :validate-on-blur="true"
    @submit="onSubmitForm"
    v-slot="$form"
  >
    <FormField v-slot="$field" name="amount" class="flex flex-col gap-1">
      <label class="font-semibold" for="penalty_amount"> Сумма </label>
      <InputNumber input-id="penalty_amount" type="text" />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error?.message }}</Message
      >
    </FormField>

    <FormField v-slot="$field" name="shiftId">
      <label class="font-semibold" for="shift"> Смена </label>
      <Select
        empty-message="Нет смен"
        :options="sortedShifts"
        fluid
        input-id="shift"
        :option-label="formatShiftDate"
        option-value="id"
      />
      <Message
        v-if="$field.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $field.error.message }}</Message
      >
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
import type { ShiftListItem } from "~/types/shifts"
import { formatDate } from "date-fns"

const props = defineProps<{
  shifts: ShiftListItem[]
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
      shiftId: z.number({ message: "Выберите смену" }),
    }),
  ),
)

const reasons: string[] = ["Невыход", "Ранний уход", "Отчет не вовремя"]

const onSubmitForm = ({ valid, values }: FormSubmitEvent): void => {
  if (valid) {
    emit("submit", values as CarTransporterPenaltyCreateEvent)
  }
}

const formatShiftDate = ({ date }: ShiftListItem): string => {
  return formatDate(date, "dd.MM.yyyy")
}

const sortedShifts = computed((): ShiftListItem[] => {
  return props.shifts.toSorted((a, b) => b.date.localeCompare(a.date))
})
</script>
