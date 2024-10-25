<template>
  <label>Выбор услуги из списка:</label>
  <Listbox
    v-model="selectedAdditionalServices"
    :options="additionalServicesOptions"
    multiple
    checkmark
  />

  <div
    v-if="selectedAdditionalServices.includes('Химчистка диска')"
    class="flex flex-col gap-y-2"
  >
    <label>Введите количество (химчистка диска)</label>
    <InputNumber v-model.number="cleanedDisksCount"/>
  </div>
  <Button
    v-if="selectedAdditionalServices.length"
    @click="selectedAdditionalServices = []"
    label="Очистить доп.услуги"
    outlined
    class="w-full"
  />
</template>

<script setup lang="ts">
const additionalServicesOptions: string[] = [
  'Пылесос багажника',
  'Мойка стекол изнутри',
  'Химчистка салона',
  'Химчистка кузова',
  'Химчистка диска',
]

const cleanedDisksCount = ref<number>()

const selectedAdditionalServices = ref<string[]>([])
</script>
