<template>
  <div class="flex flex-col gap-y-2">
    <FieldsetToggle
      v-if="'children' in service"
      :toggle-label="service.label"
      v-model="service.isIncluded"
      class="my-3"
    >
      <!-- Recursive children rendering -->
      <div v-if="service.children.length && service.isIncluded">
        <template v-for="child in service.children" :key="child.name">
          <AdditionalServicesFormListItem
            :service="child as AdditionalServiceItem & AdditionalServiceParent"
          />
        </template>
      </div>
    </FieldsetToggle>
    <template
      v-else
    >
      <FieldsetToggleAndInputNumber
        v-if="service.isCountEditable"
        :toggle-label="service.label"
        v-model:toggled="service.isIncluded"
        v-model:input-number="service.count"
      />
      <FieldsetToggle
        v-else
        :toggle-label="service.label"
        v-model="service.isIncluded"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import FieldsetToggle from '~/components/forms/FieldsetToggle.vue'
import FieldsetToggleAndInputNumber from '~/components/forms/FieldsetToggleAndInputNumber.vue'
import type { AdditionalServiceItem, AdditionalServiceParent } from '~/types/additional-services'

defineProps<{
  service: AdditionalServiceParent & AdditionalServiceItem,
}>()
</script>

