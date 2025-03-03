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
      <label class="font-semibold" for="surcharge_amount"> Сумма </label>
      <InputNumber input-id="surcharge_amount" type="text" />
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
        filter
        :filter-fields="['date']"
        filter-message="Найдено {0} смен"
        empty-filter-message="Смена не найдена"
        selection-message="Выберите смену"
        filter-icon="pi pi-search"
        filter-placeholder="Поиск по дате (YYYY-MM-DD)"
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
import type { ShiftListItem } from "~/types/shifts"
import { formatDate } from "date-fns"
import type { CarTransporterSurchargeCreateEvent } from "~/types/surcharges"

const props = defineProps<{
  shifts: ShiftListItem[]
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
      shiftId: z.number({ message: "Выберите смену" }),
    }),
  ),
)

const onSubmitForm = ({ valid, values }: FormSubmitEvent): void => {
  if (valid) {
    emit("submit", values as CarTransporterSurchargeCreateEvent)
  }
}

const formatShiftDate = ({ date }: ShiftListItem): string => {
  return formatDate(date, "dd.MM.yyyy")
}

const sortedShifts = computed((): ShiftListItem[] => {
  return props.shifts.toSorted((a, b) => a.date.localeCompare(b.date))
})
</script>
