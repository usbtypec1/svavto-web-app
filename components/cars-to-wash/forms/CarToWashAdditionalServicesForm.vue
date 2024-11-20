<template>
  <div>
    <CarToWashAdditionalServiceCountDialog
      v-model:visible="isCarToWashAdditionalServiceCountDialogVisible"
      v-model:service-id-to-count="serviceIdToCount"
      :car-wash-service="carWashServicePassedToDialog!"
    />

    <p class="text-xl font-semibold mb-2">Дополнительные услуги</p>
    <div class="flex flex-col gap-y-6">
      <Card
        v-for="[serviceParentId, services] in Object.entries(allCarWashServicesGroupedByParentId)"
        :key="serviceParentId"
      >
        <template
          #title
          v-if="serviceParentId !== 'undefined'"
        >
          {{ allCarWashServicesIdToName[serviceParentId] }}
        </template>
        <template #content>
          <div class="flex flex-col gap-y-4">
            <div
              @click="onUpdateCarToWashAdditionalServiceCountModelValue(service)"
              v-for="service in services"
              :key="service.id"
              class="flex justify-between items-center border-t border-gray-600 pt-4 cursor-pointer"
              :class="{ 'first:border-0': serviceParentId === 'undefined'}"
            >
              <label :for="service.id" class="flex flex-col cursor-pointer">
                <span>{{ service.name }}</span>
                <Message
                  v-if="service.is_countable && service.id in serviceIdToCount"
                  variant="simple"
                  severity="secondary"
                  size="small"
                >
                  {{ serviceIdToCount[service.id] }} шт.
                </Message>
              </label>
              <ToggleSwitch
                :input-id="service.id"
                :model-value="service.id in serviceIdToCount"
                readonly
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransformedCarWashServices } from '~/composables/car-wash-services'
import type { CarWashService } from '~/types/car-wash-services'
import CarToWashAdditionalServiceCountDialog
  from '~/components/cars-to-wash/dialogs/CarToWashAdditionalServiceCountDialog.vue'

const props = defineProps<{
  carWashServices: CarWashService[] | null,
}>()

const serviceIdToCount = defineModel('serviceIdToCount', { required: true, default: () => ({}) })

const isCarToWashAdditionalServiceCountDialogVisible = ref<boolean>(false)

const {
  groupedByParentId: allCarWashServicesGroupedByParentId,
  idToName: allCarWashServicesIdToName,
} = useTransformedCarWashServices(toRef(props, 'carWashServices'))

const carWashServicePassedToDialog = ref<CarWashService | null>(null)

const onUpdateCarToWashAdditionalServiceCountModelValue = (service: CarWashService): void => {
  const isToggled = service.id in serviceIdToCount.value
  if (!isToggled) {
    if (service.is_countable) {
      carWashServicePassedToDialog.value = service
      isCarToWashAdditionalServiceCountDialogVisible.value = true
    } else {
      serviceIdToCount.value[service.id] = 1
    }
  } else {
    delete serviceIdToCount.value[service.id]
  }
}
</script>
