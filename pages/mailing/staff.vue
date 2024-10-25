<template>
  <div>
    <Listbox
      v-model="selectedStaffIds"
      multiple
      checkmark
      :options="staffStore.notBannedStaff"
      option-label="full_name"
      option-value="id"
    />
    <p v-if="!anySelectedStaff">Выберите сотрудников которым нужно отправить рассылку</p>
    <MainButton
      :visible="anySelectedStaff"
      @click="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { useStaffStore } from '~/stores/staff'
import { useWebApp, MainButton, useWebAppPopup } from 'vue-tg'

const { sendData, close } = useWebApp()
const { showAlert } = useWebAppPopup()

const selectedStaffIds = ref<number[]>([])
const anySelectedStaff = computed((): boolean => selectedStaffIds.value.length > 0)

const onSubmit = () => {
  if (!selectedStaffIds.value) {
    showAlert?.('Не выбран ни один сотрудник')
  } else {
    sendData?.(JSON.stringify(selectedStaffIds.value))
    close?.()
  }
}

const staffStore = useStaffStore()
await staffStore.fetchAll()
</script>
