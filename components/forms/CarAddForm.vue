<template>
  <Form
    v-slot="$form"
    :resolver
    :initial-values="initialValues"
    @submit="onSubmit"
    class="flex flex-col gap-y-4"
  >
    <Fieldset legend="Гос.номер">
      <InputText id="number" name="number" type="text" placeholder="а111аа799" fluid/>
      <Message v-if="$form.number?.invalid" severity="error" size="small" variant="simple">
        {{ $form.number.error?.message }}
      </Message>
    </Fieldset>
    <Fieldset legend="Класс автомобиля">
      <SelectButton
        :options="classTypeOptions"
        option-label="label"
        option-value="value"
        name="classType"
      />
      <Message v-if="$form.classType?.invalid" severity="error" size="small" variant="simple">
        {{ $form.classType.error?.message }}
      </Message>
    </Fieldset>
    <Fieldset legend="Вид мойки">
      <SelectButton
        :options="washTypeOptions"
        option-label="label"
        option-value="value"
        name="washType"
      />
      <Message v-if="$form.washType?.invalid" severity="error" size="small" variant="simple">
        {{ $form.washType.error?.message }}
      </Message>
    </Fieldset>
    <Fieldset legend="Осуществлен долив стеклоомывателя">
      <div class="flex flex-col gap-y-2">
        {{ initialValues}}
        <RadioButtonGroup
          name="windshieldWasher"
          class="flex flex-col gap-y-3"
        >
          <div
            v-for="{ label, value } in windshieldWasherOptions"
            :key="value"
            class="flex items-center gap-x-2"
          >
            <RadioButton
              size="large"
              :value
              :input-id="value"
              name="windshieldWasher"
            />
            <label :for="value" class="text-md">{{ label }}</label>
          </div>
        </RadioButtonGroup>
        <Message
          v-if="$form.windshieldWasher?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.windshieldWasher.error?.message }}
        </Message>
        <div v-if="windshieldWasher === 'antifreeze'">
          <label for="windshield_washer_refilled_bottle_percentage">
            Сколько % от бутылки было залито?
          </label>
          <Select
            :options="windshieldWasherRefilledBottlePercentageOptions"
            input-id="windshield_washer_refilled_bottle_percentage"
            fluid
            class="mt-1"
            name="windshieldWasherRefilledBottlePercentage"
          />
          <Message
            v-if="$form.windshieldWasherRefilledBottlePercentage?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.windshieldWasherRefilledBottlePercentage.error.message }}
          </Message>
        </div>
      </div>
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
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod';

const carNumberRegExp = new RegExp(/^[А-Яа-я]\d{3}[А-Яа-я]{2}\d{3}$/)

const isAdditionalServicesIncluded = ref<boolean>(false)

const windshieldWasher = ref<string>()
const windshieldWasherOptions = [
  {
    label: 'Без долива',
    value: 'not_refilled',
  },
  {
    label: 'Вода',
    value: 'water',
  },
  {
    label: 'Незамерзающая жидкость',
    value: 'antifreeze',
  },
]

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


const resolver = ref(zodResolver(
  z.object({
    number: z.string({ required_error: 'Введите гос.номер' })
      .length(9, { message: 'Гос.номер должен быть длиной 9 символов' })
      .regex(
        carNumberRegExp,
        { message: 'Гос.номер должен быть в формате а111бв799 (буквы на кириллице и цифры)' },
      ),
    classType: z.enum(classTypeOptions.map(({ value }) => value), {
      required_error: 'Выберите одно из опций',
      invalid_type_error: 'Выберите одно из опций',
    }),
    washType: z.enum(washTypeOptions.map(({ value }) => value), {
      required_error: 'Выберите одно из опций',
      invalid_type_error: 'Выберите одно из опций',
    }),
    windshieldWasher: z.enum(windshieldWasherOptions.map(({ value }) => value), {
      required_error: 'Выберите одно из опций',
      invalid_type_error: 'Выберите одно из опций',
    }),
    windshieldWasherRefilledBottlePercentage: z.number(),
  }),
))

const windshieldWasherRefilledBottlePercentageOptions: number[] = [10, 20, 30, 50, 70, 90, 100, 120]

const onSubmit = (data) => {
  console.log(data)
  // console.log(isValid, values)
  // if (originalEvent.submitter.id === 'create-without-additional-services') {
  // } else if (originalEvent.submitter.id === 'create-with-additional-services') {
  //
  // }
}
</script>
