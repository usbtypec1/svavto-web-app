<template>
  <div class="flex flex-col gap-y-2">
    <RadioButtonGroup v-model="windshieldWasher" class="flex flex-col gap-y-2">
      <div
        v-for="windshieldWasherOption in windshieldWasherOptions"
        :key="windshieldWasherOption"
        class="flex items-center gap-x-2"
      >
        <RadioButton
          size="large"
          :value="windshieldWasherOption"
          :input-id="windshieldWasherOption"
        />
        <label :for="windshieldWasherOption" class="text-md">{{
          windshieldWasherOption
        }}</label>
      </div>
    </RadioButtonGroup>
    <div v-show="windshieldWasher === 'Незамерзающая жидкость'">
      <label for="windshield_washer_refilled_bottle_percentage">
        Сколько % от бутылки было залито?
      </label>
      <Select
        v-model="windshieldWasherRefilledBottlePercentage"
        :options="windshieldWasherRefilledBottlePercentageOptions"
        input-id="windshield_washer_refilled_bottle_percentage"
        fluid
        :default-value="0"
        class="mt-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const windshieldWasherOptions: string[] = [
  "Без долива",
  "Вода",
  "Незамерзающая жидкость",
]

const windshieldWasher = ref<string>(windshieldWasherOptions[0])
const windshieldWasherRefilledBottlePercentage = defineModel<number>({
  default: 0,
})

watch(windshieldWasher, (): void => {
  if (windshieldWasher.value !== windshieldWasherOptions[2]) {
    windshieldWasherRefilledBottlePercentage.value = 0
  }
})
</script>
