<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Выбрать мойку"
    class="w-full mx-4"
  >
    <div class="flex flex-col gap-y-4">
      <Select
        v-model="selectedCarWashId"
        :options="carWashes ?? []"
        option-value="id"
        option-label="name"
        placeholder="Выберите мойку"
        empty-message="Нет доступных моек"
        fluid
        :loading="carWashesStatus !== 'success'"
      />
      <Message
        v-if="isCarWashSameAsCurrent"
        severity="warn"
        icon="pi pi-exclamation-triangle"
      >
        Вы уже работаете на этой мойке
      </Message>
      <Message
        v-if="carWashesStatus === 'error'"
        severity="error"
        icon="pi pi-exclamation-triangle"
      >
        Произошла ошибка при загрузке моек
      </Message>
      <div class="flex justify-between w-full gap-2">
        <Button
          class="flex-1"
          type="button"
          icon="pi pi-times"
          label="Закрыть"
          severity="secondary"
          @click="visible = false"
        />
        <Button
          class="flex-1"
          type="button"
          icon="pi pi-check"
          label="Сохранить"
          @click="onSubmit"
          :disabled="!isValid"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { useWebAppPopup } from 'vue-tg'
import { getErrorCodes } from '~/utils/errors'
import type { CarWash } from '~/types/car-washes'
import type { ErrorResponseData } from '~/types/errors'

const emit = defineEmits(['submit'])

const { showAlert } = useWebAppPopup()

const visible = defineModel<boolean>('visible', { default: false })

const selectedCarWashId = ref<number | null>(null)

const currentCarWashId = ref<number | null>(null)

const userId = inject(userIdKey)

const runtimeConfig = useRuntimeConfig()

const { data: carWashes, status: carWashesStatus } = await useFetch<CarWash[]>('/car-washes/', {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform: (data: { car_washes: CarWash[] }): CarWash[] => data.car_washes,
})

const isCarWashSameAsCurrent = computed((): boolean => {
  return (
    currentCarWashId.value === selectedCarWashId.value
    && currentCarWashId.value !== null
    && selectedCarWashId.value !== null
  )
})

const isValid = computed((): boolean => {
  const isSuccess = carWashesStatus.value === 'success'
  const isCarWashSelected = selectedCarWashId.value !== null
  return isSuccess && isCarWashSelected && !isCarWashSameAsCurrent.value
})


const onSubmit = async (): Promise<void> => {
  try {
    await $fetch(`/shifts/current/${userId}/car-washes/`, {
      method: 'PATCH',
      body: { car_wash_id: selectedCarWashId.value },
      baseURL: runtimeConfig.public.apiBaseUrl,
    })

    emit('submit', selectedCarWashId.value)
    visible.value = false
    // showAlert('Мойка успешно изменена', () => {
    //   visible.value = false
    // })
  } catch (error) {
    const errorCodes = getErrorCodes(error.data as ErrorResponseData)
    if (errorCodes.includes('car_wash_same_as_current')) {
      currentCarWashId.value = selectedCarWashId.value
    }
  }
}
</script>
