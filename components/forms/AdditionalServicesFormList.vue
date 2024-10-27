<template>
  <Fieldset legend="Выбор услуги из списка">
    <div class="flex flex-col gap-y-2 my-3">
      <template
        v-for="service in additionalServices"
        :key="service.name"
      >
        <AdditionalServicesFormListItem :service="service"/>
      </template>
    </div>
  </Fieldset>
</template>

<script setup lang="ts">
import AdditionalServicesFormListItem from '~/components/forms/AdditionalServicesFormListItem.vue'
import type { AdditionalServiceItem, AdditionalServiceParent } from '~/types/additional-services'

const additionalServices = defineModel<(AdditionalServiceItem & AdditionalServiceParent)>({ required: true })
</script>
