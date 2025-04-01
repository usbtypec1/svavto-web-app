<template>
  <Form
    :resolver
    @submit="onSubmit"
    class="flex flex-col gap-y-4"
    :validate-on-value-update="false"
    :validate-on-blur="false"
    :validate-on-submit="true"
    :validate-on-mount="false"
    v-slot="$form"
  >
    <FormField v-slot="$number" name="number">
      <Fieldset>
        <template #legend>
          <div
            @click="onShowTextDisplayDialog('transferred_car_number_help_text')"
            class="flex items-center gap-x-2"
          >
            <i class="pi pi-info-circle"></i>
            <span>Гос.номер</span>
          </div>
        </template>
        <InputText
          id="number"
          fluid
          placeholder="а111аа799"
          type="text"
          :disabled="isAdditionalServicesIncluded"
        />
        <Message
          v-if="$number?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $number.error?.message }}
        </Message>
      </Fieldset>
    </FormField>

    <FormField v-slot="$classType" name="classType">
      <Fieldset>
        <template #legend>
          <div
            @click="onShowTextDisplayDialog('transferred_car_class_help_text')"
            class="flex items-center gap-x-2"
          >
            <i class="pi pi-info-circle"></i>
            <span>Класс автомобиля</span>
          </div>
        </template>

        <SelectButton
          :options="classTypeOptions"
          option-label="label"
          option-value="value"
          :disabled="isAdditionalServicesIncluded"
        />
        <Message
          v-if="$classType?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $classType.error?.message }}
        </Message>
      </Fieldset>
    </FormField>

    <FormField v-slot="$washType" name="washType">
      <Fieldset legend="Вид мойки">
        <SelectButton
          :options="washTypeOptions"
          option-label="label"
          option-value="value"
          :disabled="isAdditionalServicesIncluded"
        />
        <Message
          v-if="$washType?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $washType.error?.message }}
        </Message>
      </Fieldset>
    </FormField>

    <Fieldset legend="Долив воды/незамерзающей жидкости">
      <FormField v-slot="$windshieldWasherType" name="windshieldWasherType">
        <RadioButtonGroup class="flex flex-col gap-y-2">
          <div
            v-for="windshieldWasherTypeOption in windshieldWasherTypeOptions"
            :key="windshieldWasherTypeOption.value"
            class="flex items-center gap-x-2"
          >
            <RadioButton
              size="large"
              :value="windshieldWasherTypeOption.value"
              :input-id="windshieldWasherTypeOption.value"
              :disabled="isAdditionalServicesIncluded"
            />
            <label :for="windshieldWasherTypeOption.value" class="text-md">{{
              windshieldWasherTypeOption.label
            }}</label>
          </div>
          <Message
            v-if="$windshieldWasherType?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $windshieldWasherType.error.message }}
          </Message>
        </RadioButtonGroup>
      </FormField>
      <FormField
        v-slot="$windshieldWasherRefilledBottlePercentage"
        name="windshieldWasherRefilledBottlePercentage"
        :initial-value="0"
        v-show="
          $form.windshieldWasherType?.value ===
            WindshieldWasherType.Antifreeze
        "
      >
        <div class="mt-2">
          <label for="windshield_washer_refilled_bottle_percentage">
            Сколько % от бутылки было залито?
          </label>
          <Select
            :options="windshieldWasherRefilledBottlePercentageOptions"
            input-id="windshield_washer_refilled_bottle_percentage"
            fluid
            :default-value="0"
            class="mt-1"
            name="windshieldWasherRefilledBottlePercentage"
            :disabled="isAdditionalServicesIncluded"
          />
          <Message
            v-if="$windshieldWasherRefilledBottlePercentage?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $windshieldWasherRefilledBottlePercentage.error.message }}
          </Message>
        </div>
      </FormField>
    </Fieldset>

    <Fieldset
      v-if="!isAdditionalServicesIncluded"
      class="font-semibold mb-1"
      legend="Добавить доп.услуги?"
    >
      <div class="flex gap-x-3 justify-between">
        <Button
          label="Да"
          icon="pi pi-plus"
          class="flex-1"
          type="submit"
          id="create-with-additional-services"
        />
        <Button
          label="Позже"
          icon="pi pi-clock"
          severity="secondary"
          class="flex-1"
          type="submit"
          id="create-without-additional-services"
        />
      </div>
    </Fieldset>
  </Form>
  <TextDisplayDialog
    :text-key="textKey!"
    v-model:visible="isTextDialogVisible"
  />
</template>

<script setup lang="ts">
import type { CarToWashDraft } from "~/types/cars"
import { Form, FormField, type FormSubmitEvent } from "@primevue/forms"
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { z } from "zod"
import { classTypeOptions, washTypeOptions } from "~/utils/car-wash-services"
import {
  windshieldWasherRefilledBottlePercentageOptions,
  windshieldWasherTypeOptions,
} from "~/utils/car-transfers"
import { WindshieldWasherType } from "~/types/cars"

const emit = defineEmits([
  "submitWithoutAdditionalServices",
  "submitWithAdditionalServices",
])

const props = defineProps<{
  isWindshieldWasherHidden: boolean
}>()

const isAdditionalServicesIncluded = ref<boolean>(false)

const initialValues = ref<CarToWashDraft>({})

const carNumberRegExp = new RegExp(/^[А-Яа-я]\d{3}[А-Яа-я]{2}\d{3}$/)

const resolver = ref(
  zodResolver(
    z.object({
      number: z
        .string({ message: "Введите гос.номер" })
        .length(9, { message: "Гос.номер должен быть длиной 9 символов" })
        .regex(carNumberRegExp, {
          message:
            "Гос.номер должен быть в формате а111бв799 (буквы на кириллице и цифры)",
        }),
      classType: z.enum(
        classTypeOptions.map(({ value }) => value),
        {
          message: "Выберите одно из опций",
        },
      ),
      washType: z.enum(
        washTypeOptions.map(({ value }) => value),
        {
          message: "Выберите одно из опций",
        },
      ),
      windshieldWasherType: z.enum(
        windshieldWasherTypeOptions.map(({ value }) => value),
        {
          message: "Выберите одно из опций",
        },
      ),
      windshieldWasherRefilledBottlePercentage: z.number({
        message: "Выберите % от бутылки, который был залит",
      }),
    }),
  ),
)

const onSubmit = ({ valid, values, originalEvent }: FormSubmitEvent) => {
  if (!valid) {
    console.log(`Invalid car add form: values=${JSON.stringify(values)}`)
    return
  }

  if (values.windshieldWasherType === WindshieldWasherType.None) {
    values.windshieldWasherRefilledBottlePercentage = 0
    values.windshieldWasherType = WindshieldWasherType.Antifreeze
  } else if (values.windshieldWasherType === WindshieldWasherType.Water) {
    values.windshieldWasherRefilledBottlePercentage = 0
  }

  if (originalEvent.submitter.id === "create-without-additional-services") {
    emit("submitWithoutAdditionalServices", values)
  } else if (originalEvent.submitter.id === "create-with-additional-services") {
    isAdditionalServicesIncluded.value = true
    emit("submitWithAdditionalServices", values)
  }
}

const isTextDialogVisible = ref<boolean>(false)
const textKey = ref<string | null>(null)
const onShowTextDisplayDialog = (key: string): void => {
  textKey.value = key
  isTextDialogVisible.value = true
  console.log("onShowTextDisplayDialog", key)
}
</script>
