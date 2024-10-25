<template>
  <form
    @submit.prevent
    class="flex flex-col gap-y-4"
  >
    <div class="flex flex-col gap-y-2">
      <label class="font-semibold">Гос.номер автомобиля в формате а111аа799</label>
      <InputText v-model.trim="carNumber"/>
    </div>
    <div class="flex flex-col gap-y-2">
      <label class="font-semibold">Какому классу принадлежит автомобиль</label>
      <SelectButton v-model="carClass" :options="carClassOptions"/>
    </div>
    <div class="flex flex-col gap-y-2">
      <label class="font-semibold">Вид мойки</label>
      <SelectButton v-model="carWashType" :options="carWashTypeOptions"/>
    </div>
    <div class="flex flex-col gap-y-2">
      <label class="font-semibold">Осуществлен долив стеклоомывателя?</label>
      <ToggleButton v-model="isWindshieldWasherRefilled" off-label="Нет" on-label="Да"/>
    </div>
    <div v-if="isWindshieldWasherRefilled" class="flex flex-col gap-y-2">
      <label class="font-semibold">Сколько % от бутылки было залито?</label>
      <Select
        v-model="windshieldWasherRefilledBottlePercentage"
        :options="windshieldWasherRefilledBottlePercentageOptions"
      />
    </div>
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
