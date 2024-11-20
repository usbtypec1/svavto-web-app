<template>
  <Form
    :resolver
    @submit="onSubmit"
    class="flex flex-col gap-y-4"
  >
    <FormField
      v-slot="$number"
      name="number"
    >
      <Fieldset legend="Гос.номер">
        <InputText
          id="number"
          fluid
          placeholder="а111аа799"
          type="text"
          :disabled="isAdditionalServicesIncluded"
        />
        <Message v-if="$number?.invalid" severity="error" size="small" variant="simple">
          {{ $number.error?.message }}
        </Message>
      </Fieldset>
    </FormField>

    <FormField
      v-slot="$classType"
      name="classType"
    >
      <Fieldset legend="Класс автомобиля">
        <SelectButton
          :options="classTypeOptions"
          option-label="label"
          option-value="value"
          :disabled="isAdditionalServicesIncluded"
        />
        <Message v-if="$classType?.invalid" severity="error" size="small" variant="simple">
          {{ $classType.error?.message }}
        </Message>
      </Fieldset>
    </FormField>

    <FormField
      v-slot="$washType"
      name="washType"
    >
      <Fieldset legend="Вид мойки">
        <SelectButton
          :options="washTypeOptions"
          option-label="label"
          option-value="value"
          :disabled="isAdditionalServicesIncluded"
        />
        <Message v-if="$washType?.invalid" severity="error" size="small" variant="simple">
          {{ $washType.error?.message }}
        </Message>
      </Fieldset>
    </FormField>

    <Fieldset legend="Долив воды/незамерзающей жидкости">
      <FormField
        v-slot="$windshieldWasher"
        name="windshieldWasher"
      >
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
            <label :for="windshieldWasherOption" class="text-md">{{ windshieldWasherOption }}</label>
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
import type { CarToWashDraft, ClassType, WashType } from '~/types/cars'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod';

const emit = defineEmits(['submitWithoutAdditionalServices', 'submitWithAdditionalServices'])

const isAdditionalServicesIncluded = ref<boolean>(false)

const initialValues = ref<CarToWashDraft>({})

const classTypeOptions: ClassType[] = [
  {
    label: 'Комфорт',
    value: 'comfort',
  },
  {
    label: 'Бизнес',
    value: 'business',
  },
  {
    label: 'Фургон',
    value: 'van',
  },
]

const washTypeOptions: WashType[] = [
  {
    label: 'Плановая',
    value: 'planned',
  },
  {
    label: 'Срочная',
    value: 'urgent',
  },
]

const windshieldWasherOptions: string[] = [
  'Без долива',
  'Вода',
  'Незамерзающая жидкость',
]

const carNumberRegExp = new RegExp(/^[А-Яа-я]\d{3}[А-Яа-я]{2}\d{3}$/)

const resolver = ref(zodResolver(
  z.object({
    number: z.string({ message: 'Введите гос.номер' })
      .length(9, { message: 'Гос.номер должен быть длиной 9 символов' })
      .regex(carNumberRegExp, { message: 'Гос.номер должен быть в формате а111бв799 (буквы на кириллице и цифры)' }),
    classType: z.enum(classTypeOptions.map(({ value }) => value), {
      message: 'Выберите одно из опций',
    }),
    washType: z.enum(washTypeOptions.map(({ value }) => value), {
      message: 'Выберите одно из опций',
    }),
    windshieldWasher: z.enum(windshieldWasherOptions, {
      message: 'Выберите одно из опций',
    }),
    windshieldWasherRefilledBottlePercentage: z.number({
      message: 'Выберите % от бутылки, который был залит',
    }),
  }),
))

const windshieldWasherRefilledBottlePercentageOptions: number[] = [10, 20, 30, 50, 70, 90, 100, 120]

const onSubmit = ({ valid, values, originalEvent }: FormSubmitEvent) => {
  if (!valid) {
    console.log(`Invalid car add form: values=${JSON.stringify(values)}`)
    return
  }
  if (originalEvent.submitter.id === 'create-without-additional-services') {
    emit('submitWithoutAdditionalServices', values)
  } else if (originalEvent.submitter.id === 'create-with-additional-services') {
    emit('submitWithAdditionalServices', values)
  }
}
</script>
