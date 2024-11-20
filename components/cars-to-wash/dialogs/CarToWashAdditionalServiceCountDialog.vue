<template>
  <Dialog
    v-model:visible="visible"
    modal
    class="w-full mx-4"
    :header="carWashService?.name"
  >
    <div class="flex flex-col gap-y-1">
      <label :for="countInputId" class="font-semibold">Количество</label>
      <InputNumber
        v-model.number="count"
        :min="0"
        :max="1_000"
        :input-id="countInputId"
        fluid
        :invalid="count === null"
      />
      <Message
        v-if="count === null"
        variant="simple"
        severity="error"
        size="small"
      >
        Введите количество
      </Message>
    </div>
    <template #footer>
      <div class="w-full flex gap-x-2">
        <Button
          class="flex-1"
          label="Отменить"
          icon="pi pi-times"
          severity="secondary"
          @click="visible = false"
          autofocus
        />
        <Button
          @click="onSubmit"
          class="flex-1"
          label="Сохранить"
          icon="pi pi-check"
          type="submit"
          autofocus
          :disabled="count === null"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { CarWashService } from '~/types/car-wash-services'

const countInputId = useId()

const visible = defineModel('visible', { required: true, default: false })
const serviceIdToCount = defineModel('serviceIdToCount', { required: true })

const props = defineProps<{
  carWashService?: CarWashService,
}>()

const count = ref<number | null>(null)

const onSubmit = (): void => {
  visible.value = false
  serviceIdToCount.value[props.carWashService.id] = count.value
  count.value = null
}
</script>
