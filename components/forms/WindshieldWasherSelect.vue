<template>
  <div class="flex flex-col gap-y-2">
    <RadioButtonGroup
      v-model="WindshieldWasherType"
      class="flex flex-col gap-y-2"
    >
      <div
        v-for="windshieldWasherTypeOption in windshieldWasherTypeOptions"
        :key="windshieldWasherTypeOption.value"
        class="flex items-center gap-x-2"
      >
        <RadioButton
          size="large"
          :value="windshieldWasherTypeOption.value"
          :input-id="windshieldWasherTypeOption.value"
        />
        <label :for="windshieldWasherTypeOption.value" class="text-md">{{
          windshieldWasherTypeOption.label
        }}</label>
      </div>
    </RadioButtonGroup>
    <div
      v-show="windshieldWasherType.value === WindshieldWasherType.Antifreeze"
    >
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
import {
  WindshieldWasherType,
  type WindshieldWasherTypeOption,
} from "~/types/cars"
import {
  windshieldWasherRefilledBottlePercentageOptions,
  windshieldWasherTypeOptions,
} from "~/utils/car-transfers"

const windshieldWasherType = ref<WindshieldWasherTypeOption>(
  windshieldWasherTypeOptions[0],
)
const windshieldWasherRefilledBottlePercentage = defineModel<number>({
  default: 0,
})

watchEffect((): void => {
  if (windshieldWasherRefilledBottlePercentage.value > 0) {
    windshieldWasherType.value = windshieldWasherTypeOptions[2]
  }
})

watchEffect((): void => {
  if (windshieldWasherType.value !== windshieldWasherTypeOptions[2]) {
    windshieldWasherRefilledBottlePercentage.value = 0
  }
})
</script>
