<template>
  <div>
    <CarToWashAdditionalServiceCountDialog
      v-model:visible="isCarToWashAdditionalServiceCountDialogVisible"
      v-model:service-id-to-count="serviceIdToCount"
      :car-wash-service="carWashServicePassedToDialog!"
    />
    <Message
      v-if="!specificCarWashServices?.length"
      severity="warn"
    >
      Нет доступных услуг
    </Message>
    <div class="flex flex-col gap-y-6">
      <Card
        v-for="[serviceParentId, services] in Object.entries(carWashServicesGroupedByParentId).sort(([a], [b]) => b.localeCompare(a))"
        :key="serviceParentId"
      >
        <template
          #title
          v-if="serviceParentId !== 'undefined'"
        >
          {{ carWashServicesIdToName[serviceParentId] }}
        </template>
        <template #content>
          <div class="flex flex-col gap-y-4">
            <div
              @click="onUpdateCarToWashAdditionalServiceCountModelValue(service)"
              v-for="service in services"
              :key="service.id"
              class="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-4 cursor-pointer"
              :class="{ 'first:border-0': serviceParentId === 'undefined'}"
            >
              <label class="flex flex-col cursor-pointer select-none">
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
  specificCarWashServices?: CarWashService[] | null,
}>()

const serviceIdToCount = defineModel<Record<string, number>>('serviceIdToCount', { required: true, default: () => ({}) })

const isCarToWashAdditionalServiceCountDialogVisible = ref<boolean>(false)

const {
  groupedByParentId: carWashServicesGroupedByParentId,
  idToName: carWashServicesIdToName,
} = useTransformedCarWashServices(toRef(props, 'specificCarWashServices'))

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
