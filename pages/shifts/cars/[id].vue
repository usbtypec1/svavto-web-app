<template>
  <div>
    <AdditionalServicesForm/>
  </div>
</template>

<script setup lang="ts">
import AdditionalServicesForm from '~/components/forms/AdditionalServicesForm.vue'

const route = useRoute()

const carId = Number(route.params.id as string)
</script>
