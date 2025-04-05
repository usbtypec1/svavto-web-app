<template>
  <Dialog
    v-model:visible="visible"
    modal
    class="w-full mx-4"
    :header="carWashService?.name"
  >
    <Form
      @submit="onSubmit"
      :resolver="resolver"
      :validate-on-blur="true"
      :validate-on-mount="false"
      :validate-on-submit="true"
      :validate-on-value-update="false"
    >
      <FormField v-slot="$count" name="count">
        <label :for="countInputId" class="font-semibold">Количество</label>
        <InputNumber :input-id="countInputId" fluid />
        <Message
          v-if="$count?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $count.error?.message }}
        </Message>
      </FormField>

      <div class="w-full flex gap-x-2 mt-4">
        <Button
          class="flex-1"
          label="Отменить"
          icon="pi pi-times"
          severity="secondary"
          type="button"
          @click="visible = false"
        />
        <Button
          class="flex-1"
          label="Сохранить"
          icon="pi pi-check"
          type="submit"
        />
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { zodResolver } from "@primevue/forms/resolvers/zod"
import type { CarWashService } from "~/types/car-wash-services"
import { z } from "zod"
import type { FormSubmitEvent } from "@primevue/forms"

const countInputId = useId()

const visible = defineModel<boolean>("visible", {
  required: true,
  default: false,
})
const serviceIdToCount = defineModel<Record<string, number>>(
  "serviceIdToCount",
  { required: true },
)

const props = defineProps<{
  carWashService?: CarWashService
}>()
const maxCount = computed((): number => props.carWashService?.max_count ?? 1000)

const resolver = computed(() => (
  zodResolver(
    z.object({
      count: z
        .number({ message: "Введите количество" })
        .min(1, { message: "Введите значение больше нуля" })
        .max(maxCount.value, {
          message: `Максимально допустимое значение - ${maxCount.value}`,
        }),
    }),
  )
))

interface FormValues {
  count: number
}

const onSubmit = ({ valid, values }: FormSubmitEvent): void => {
  if (valid) {
    visible.value = false
    serviceIdToCount.value[props.carWashService!.id] = (
      values as FormValues
    ).count
  }
}
</script>
