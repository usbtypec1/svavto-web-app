<template>
  <Dialog
    v-model:visible="visible"
    modal
    class="w-full mx-4"
    :header="carWashService?.name"
  >
    <div class="py-2">
      <FloatLabel variant="on">
        <InputNumber
          v-model.number="price"
          :min="0"
          :max="1_000_000"
          :input-id="priceInputId"
          fluid
        />
        <label :for="priceInputId">Цена</label>
      </FloatLabel>
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
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { CarWashService } from '~/types/car-wash-services'

const emit = defineEmits(['submit'])

const priceInputId = useId()

const visible = defineModel('visible', { required: true, default: false })

const props = defineProps<{
  carWashService?: CarWashService,
  price: number,
}>()

const price = ref<number>(props.price)

const onSubmit = (): void => {
  visible.value = false
  emit('submit', {
    carWashServiceId: props.carWashService.id,
    price: price.value,
  })
}
</script>
