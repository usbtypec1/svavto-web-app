<template>
  <form
    @submit.prevent
    class="flex flex-col gap-y-4"
  >
    <Fieldset legend="Гос.номер автомобиля в формате а111аа799">
      <InputText class="w-full" v-model.trim="carToWash.number"/>
    </Fieldset>
    <Fieldset legend="Класс автомобиля">
      <SelectButton
        v-model="carToWash.classType"
        :options="classTypeOptions"
        option-label="label"
        option-value="value"
      />
    </Fieldset>
    <Fieldset legend="Вид мойки">
      <SelectButton
        v-model="carToWash.washType"
        :options="washTypeOptions"
        option-label="label"
        option-value="value"
      />
    </Fieldset>
    <Fieldset legend="Осуществлен долив стеклоомывателя">
      <div class="flex flex-col gap-y-2">
        <ToggleButton
          v-model="isWindshieldWasherRefilled"
          off-label="Нет"
          on-label="Да"
          on-icon="pi pi-check"
        />
        <div v-if="isWindshieldWasherRefilled" class="flex flex-col gap-y-2">
          <label class="font-semibold">Сколько % от бутылки было залито?</label>
          <Select
            v-model="carToWash.windshieldWasherRefilledBottlePercentage"
            :options="windshieldWasherRefilledBottlePercentageOptions"
          />
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
          @click="onIncludeAdditionalServices"
          label="Да"
          class="flex-1"
        />
        <Button
          label="Добавить позже"
          severity="secondary"
          class="flex-1"
        />
      </div>
    </Fieldset>
  </form>
</template>

<script setup lang="ts">
import type { CarToWashDraft, ClassType, WashType } from '~/types/cars'

const emit = defineEmits(['includeAdditionalServices'])

const isAdditionalServicesIncluded = defineModel<boolean>('isAdditionalServicesIncluded', { required: true })

const onIncludeAdditionalServices = (): void => {
  emit('includeAdditionalServices', carToWash)
  isAdditionalServicesIncluded.value = true
}

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

const carToWash = ref<CarToWashDraft>({
  number: undefined,
  classType: undefined,
  washType: undefined,
  windshieldWasherRefilledBottlePercentage: undefined,
})
const isWindshieldWasherRefilled = ref<boolean>(false)
const windshieldWasherRefilledBottlePercentageOptions: number[] = [10, 20, 30, 50, 70, 90, 100, 120]

watch(isWindshieldWasherRefilled, () => {
  carToWash.value.windshieldWasherRefilledBottlePercentage = undefined
})
</script>
