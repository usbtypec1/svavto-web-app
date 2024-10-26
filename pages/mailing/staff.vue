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
    <transition-group name="p-message" tag="div" class="flex flex-col">
      <Message
        v-if="!anySelectedStaff"
        severity="info"
        class="my-3"
      >
        Выберите сотрудников которым нужно отправить рассылку
      </Message>
    </transition-group>
    <MainButton
      :visible="anySelectedStaff"
      @click="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { useStaffStore } from '~/stores/staff'
import { MainButton, useWebApp } from 'vue-tg'

const { sendData } = useWebApp()

const selectedStaffIds = ref<number[]>([])
const anySelectedStaff = computed((): boolean => selectedStaffIds.value.length > 0)

const onSubmit = () => {
  sendData?.(JSON.stringify(selectedStaffIds.value))
}

const staffStore = useStaffStore()
await staffStore.fetchAll()
</script>
