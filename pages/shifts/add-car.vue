<template>
  <div>
    <CarAddForm/>
    <div v-if="!isAdditionalServicesEnabled">
      <p class="font-semibold mb-1">Добавить доп.услуги?</p>
      <div class="flex gap-x-3 justify-between">
        <Button
          @click="isAdditionalServicesEnabled = true"
          label="Да"
          class="flex-1"
        />
        <Button
          @click="onFinishCarAdd"
          label="Добавить позже"
          severity="secondary"
          class="flex-1"
        />
      </div>
    </div>
    <AdditionalServicesForm v-else/>
  </div>
</template>

<script setup lang="ts">
import CarAddForm from '~/components/forms/CarAddForm.vue'
import AdditionalServicesForm from '~/components/forms/AdditionalServicesForm.vue'

const confirm = useConfirm()
const toast = useToast()

const isAdditionalServicesEnabled = ref<boolean>(false)

const finishCarAdd = () => {
  toast.add({
    severity: 'success',
    summary: 'Автомобиль добавлен',
    detail: 'Автомобиль {ГОС НОМЕР} записан. Добавить доп услуги или завершить автомобиль можно будет позже в главном меню',
    life: 10000,
  })
}

const onFinishCarAdd = () => {
  confirm.require({
    header: 'Подтвердите',
    message: 'Вы уверены, что хотите завершить добавление автомобиля?',
    accept: finishCarAdd,
    rejectProps: {
      severity: 'secondary',
    },
  })
}
</script>
