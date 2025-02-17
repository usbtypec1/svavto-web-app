<template>
  <Form :resolver @submit="onSubmit" class="flex flex-col gap-y-4">
    <FormField v-slot="$number" name="number">
      <Fieldset>
        <template #legend>
          <div
            @click="onShowCarNumberHelpText"
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
      <Fieldset legend="Класс автомобиля">
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
      <FormField v-slot="$windshieldWasher" name="windshieldWasher">
        <RadioButtonGroup class="flex flex-col gap-y-2">
          <div
            v-for="windshieldWasherOption in windshieldWasherOptions"
            :key="windshieldWasherOption"
            class="flex items-center gap-x-2"
          >
            <RadioButton
              size="large"
              :value="windshieldWasherOption"
              :input-id="windshieldWasherOption"
              :disabled="isAdditionalServicesIncluded"
            />
            <label :for="windshieldWasherOption" class="text-md">{{
              windshieldWasherOption
            }}</label>
          </div>
          <Message
            v-if="$windshieldWasher?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $windshieldWasher.error.message }}
          </Message>

          <FormField
            v-slot="$windshieldWasherRefilledBottlePercentage"
            name="windshieldWasherRefilledBottlePercentage"
            :initial-value="0"
          >
            <div v-show="$windshieldWasher.value === 'Незамерзающая жидкость'">
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
        </RadioButtonGroup>
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
</template>

<script setup lang="ts">
import type { CarToWashDraft } from "~/types/cars"
import { Form, FormField, type FormSubmitEvent } from "@primevue/forms"
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { z } from "zod"
import { classTypeOptions, washTypeOptions } from "~/utils/car-wash-services"
import { useWebAppPopup } from "vue-tg"
import { windshieldWasherRefilledBottlePercentageOptions, windshieldWasherOptions } from "~/utils/car-transfers"

const emit = defineEmits([
  "submitWithoutAdditionalServices",
  "submitWithAdditionalServices",
])

const { showAlert } = useWebAppPopup()

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
      windshieldWasher: z.enum(windshieldWasherOptions, {
        message: "Выберите одно из опций",
      }),
      windshieldWasherRefilledBottlePercentage: z.number({
        message: "Выберите % от бутылки, который был залит",
      }),
    }),
  ),
)

const onShowCarNumberHelpText = (): void => {
  showAlert(
    "Если в сервисном приложении нажать на номер, он скопируется и не придется печатать его вручную.",
  )
}

const onSubmit = ({ valid, values, originalEvent }: FormSubmitEvent) => {
  if (!valid) {
    console.log(`Invalid car add form: values=${JSON.stringify(values)}`)
    return
  }
  if (originalEvent.submitter.id === "create-without-additional-services") {
    emit("submitWithoutAdditionalServices", values)
  } else if (originalEvent.submitter.id === "create-with-additional-services") {
    isAdditionalServicesIncluded.value = true
    emit("submitWithAdditionalServices", values)
  }
}
</script>
