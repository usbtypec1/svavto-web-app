<template>
  <form
    @submit.prevent
    class="flex flex-col gap-y-4"
  >
    <Fieldset legend="Гос.номер автомобиля в формате а111аа799">
      <InputText class="w-full" v-model.trim="carNumber"/>
    </Fieldset>
    <Fieldset legend="Класс автомобиля">
      <SelectButton v-model="carClass" :options="carClassOptions"/>
    </Fieldset>
    <Fieldset legend="Вид мойки">
      <SelectButton v-model="carWashType" :options="carWashTypeOptions"/>
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
            v-model="windshieldWasherRefilledBottlePercentage"
            :options="windshieldWasherRefilledBottlePercentageOptions"
          />
        </div>
      </div>
    </Fieldset>
  </form>
</template>

<script setup lang="ts">
const carNumber = ref<string>()
const carClassOptions: string[] = ['Комфорт', 'Бизнес', 'Фургон']
const carClass = ref<string>()
const carWashTypeOptions: string[] = ['Плановая', 'Срочная']
const carWashType = ref<string>()
const isWindshieldWasherRefilled = ref<boolean>()
const windshieldWasherRefilledBottlePercentageOptions: string[] = ['10%', '20%', '30%', '50%', '70%', '90%', '100%', '120%']
const windshieldWasherRefilledBottlePercentage = ref<string | null>(null)

watch(isWindshieldWasherRefilled, () => {
  windshieldWasherRefilledBottlePercentage.value = null
})
</script>
