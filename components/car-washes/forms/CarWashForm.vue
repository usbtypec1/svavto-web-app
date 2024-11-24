<template>
  <Form
    v-slot="$form"
    @submit="onSubmit"
    :resolver="resolver"
    class="flex flex-col gap-y-2"
  >
    <FormField
      v-for="field in fields"
      v-slot="$field"
      :name="field.name"
      :initialValue="initialValues[field.name] ?? field.initialValue"
      class="flex flex-col gap-1"
    >
      <label class="font-semibold">{{ field.label }}</label>
      <InputText v-if="field.type === 'text'" type="text" />
      <InputNumber v-else-if="field.type === 'number'" />
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
import { Form, FormField, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

interface Props {
  initialValues?: Record<string, string | number>;
}

const { initialValues = {} } = defineProps<Props>();

const emit = defineEmits(["submit"]);

const isLoading = defineModel<boolean>("isLoading", { default: false });

const fields = [
  {
    name: "name",
    label: "Название",
    type: "text",
    initialValue: "Ул. Пушкина, д. Колотушкина",
  },
  {
    name: "comfort_class_car_transfer_price",
    label: "Комплекс комфорт класс",
    type: "number",
    initialValue: 0,
  },
  {
    name: "business_class_car_transfer_price",
    label: "Комплекс бизнес класс",
    type: "number",
    initialValue: 0,
  },
  {
    name: "van_transfer_price",
    label: "Комплекс фургонов",
    type: "number",
    initialValue: 0,
  },
  {
    name: "windshield_washer_price_per_bottle",
    label: "Долив 100% бутылки незамерзайки",
    type: "number",
    initialValue: 0,
  },
];

const resolver = ref(
  zodResolver(
    z.object({
      name: z
        .string()
        .min(1, { message: "Минимальная длина названия - 1 символ" })
        .max(100, { message: "Максимальная длина названия - 100 символов" }),
      comfort_class_car_transfer_price: z
        .number({ message: "Введите цену " })
        .min(0),
      business_class_car_transfer_price: z
        .number({ message: "Введите цену " })
        .min(0),
      van_transfer_price: z.number({ message: "Введите цену " }).min(0),
      windshield_washer_price_per_bottle: z
        .number({ message: "Введите цену " })
        .min(0),
    })
  )
);

const onSubmit = ({ values, valid }: FormSubmitEvent): void => {
  if (!valid) return;
  emit("submit", values);
};
</script>
