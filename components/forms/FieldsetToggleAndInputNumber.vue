<template>
  <Fieldset :legend="toggleLabel">
    <div class="flex flex-col gap-y-2">
      <ToggleButton
        v-model="toggled"
        off-label="Нет"
        on-label="Да"
        on-icon="pi pi-check"
      />
      <div
        v-if="toggled"
        class="flex flex-col"
      >
        <label :for="inputNumberId">Количество</label>
        <InputNumber
          v-model="inputNumber"
          :input-id="inputNumberId"
          mode="decimal"
          show-buttons
          button-layout="horizontal"
          :min="1"
          :max="16"
        >
          <template #incrementbuttonicon>
            <span class="pi pi-plus"/>
          </template>
          <template #decrementbuttonicon>
            <span class="pi pi-minus"/>
          </template>
        </InputNumber>
      </div>
    </div>
  </Fieldset>
</template>

<script setup lang="ts">
defineProps<{
  toggleLabel: string,
}>()

const toggled = defineModel<boolean>('toggled', { required: true })
const inputNumber = defineModel<number>('inputNumber', { required: true })

const inputNumberId = useId()

watch(toggled, () => inputNumber.value = 1)
</script>
