<template>
  <Form
    v-slot="$form"
    @submit="onSubmit"
    :resolver="resolver"
    :validate-on-value-update="false"
    :validate-on-blur="false"
    :validate-on-mount="false"
    :validate-on-submit="true"
    class="flex flex-col gap-y-2"
    :initial-values="initialValues"
  >
    <FormField name="name" v-slot="$field" class="flex flex-col gap-1">
      <label class="font-semibold">Название</label>
      <InputText />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </FormField>

    <Fieldset legend="Перегонщики">
      <FormField
        name="car_transporters_comfort_class_car_washing_price"
        v-slot="$field"
        class="flex flex-col gap-1"
      >
        <label class="font-semibold">Комплекс комфорт класс</label>
        <InputNumber />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        name="car_transporters_business_class_car_washing_price"
        v-slot="$field"
        class="flex flex-col gap-1"
      >
        <label class="font-semibold">Комплекс бизнес класс</label>
        <InputNumber />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        name="car_transporters_van_washing_price"
        v-slot="$field"
        class="flex flex-col gap-1"
      >
        <label class="font-semibold">Комплекс фургонов</label>
        <InputNumber />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </Message>
      </FormField>
    </Fieldset>

    <Fieldset legend="Перегонщики-мойщики">
      <FormField
        name="car_transporters_and_washers_comfort_class_price"
        v-slot="$field"
        class="flex flex-col gap-1"
      >
        <label class="font-semibold">Комплекс комфорт класс</label>
        <InputNumber />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        name="car_transporters_and_washers_business_class_price"
        v-slot="$field"
        class="flex flex-col gap-1"
      >
        <label class="font-semibold">Комплекс бизнес класс</label>
        <InputNumber />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </Message>
      </FormField>

      <FormField
        name="car_transporters_and_washers_van_price"
        v-slot="$field"
        class="flex flex-col gap-1"
      >
        <label class="font-semibold">Комплекс фургонов</label>
        <InputNumber />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field.error?.message }}
        </Message>
      </FormField>
    </Fieldset>

    <FormField
      name="windshield_washer_price_per_bottle"
      v-slot="$field"
      class="flex flex-col gap-1"
    >
      <label class="font-semibold">Долив 100% бутылки незамерзайки</label>
      <InputNumber />
      <Message
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </Message>
    </FormField>

    <Button
      :loading="isLoading"
      type="submit"
      icon="pi pi-check"
      label="Сохранить"
      fluid
      raised
      class="my-2"
      :disabled="!$form.valid"
    />
  </Form>
</template>

<script setup lang="ts">
import { Form, FormField, type FormSubmitEvent } from "@primevue/forms"
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { z } from "zod"
import type { CarWashFormValues } from "~/types/car-washes"

const props = withDefaults(
  defineProps<{
    initialValues?: CarWashFormValues
  }>(),
  {
    initialValues: (): CarWashFormValues => ({
      name: "Ул. Пушкина, д. Колотушкина",
      car_transporters_comfort_class_car_washing_price: 0,
      car_transporters_business_class_car_washing_price: 0,
      car_transporters_van_washing_price: 0,
      car_transporters_and_washers_comfort_class_price: 0,
      car_transporters_and_washers_business_class_price: 0,
      car_transporters_and_washers_van_price: 0,
      windshield_washer_price_per_bottle: 0,
    }),
  },
)

const emit = defineEmits<{
  submit: [event: CarWashFormValues]
}>()

const isLoading = defineModel<boolean>("isLoading", { default: false })

const resolver = ref(
  zodResolver(
    z.object({
      name: z
        .string()
        .min(1, { message: "Минимальная длина названия - 1 символ" })
        .max(100, { message: "Максимальная длина названия - 100 символов" }),
      car_transporters_comfort_class_car_washing_price: z
        .number({ message: "Введите цену " })
        .min(0),
      car_transporters_business_class_car_washing_price: z
        .number({ message: "Введите цену " })
        .min(0),
      car_transporters_van_washing_price: z
        .number({ message: "Введите цену " })
        .min(0),
      car_transporters_and_washers_comfort_class_price: z
        .number({ message: "Введите цену " })
        .min(0),
      car_transporters_and_washers_business_class_price: z
        .number({ message: "Введите цену " })
        .min(0),
      car_transporters_and_washers_van_price: z
        .number({ message: "Введите цену " })
        .min(0),
      windshield_washer_price_per_bottle: z
        .number({ message: "Введите цену " })
        .min(0),
    }),
  ),
)

const onSubmit = ({ values, valid }: FormSubmitEvent): void => {
  if (!valid) return
  console.log("[Car wash form]: submitting values", values)
  emit("submit", values as CarWashFormValues)
}
</script>
