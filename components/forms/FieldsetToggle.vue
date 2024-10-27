<template>
  <Fieldset :legend="toggleLabel">
    <ToggleButton
      v-model="toggled"
      class="w-full"
      off-label="Нет"
      on-label="Да"
      on-icon="pi pi-check"
    />
    <slot/>
  </Fieldset>
</template>

<script setup lang="ts">
defineProps<{
  toggleLabel: string,
}>()

const toggled = defineModel<boolean>({ required: true })
</script>
