<template>
  <div>
    <Listbox
      v-model="selectedStaffIds"
      multiple
      checkmark
      :options="notBannedStaffList"
      option-label="full_name"
      option-value="id"
    />
    <transition-group name="p-message" tag="div" class="flex flex-col">
      <Message v-if="!anySelectedStaff" severity="info" class="my-3">
        Выберите сотрудников которым нужно отправить рассылку
      </Message>
    </transition-group>
    <MainButton :visible="anySelectedStaff" @click="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp } from "vue-tg"
import type { Staff } from "~/types/staff"

const { sendData } = useWebApp()

const selectedStaffIds = ref<number[]>([])
const anySelectedStaff = computed(
  (): boolean => selectedStaffIds.value.length > 0,
)

const onSubmit = () => {
  sendData?.(JSON.stringify(selectedStaffIds.value))
}

const runtimeConfig = useRuntimeConfig()

const { data: staffList } = useFetch("/staff/", {
  baseURL: runtimeConfig.public.apiBaseUrl,
  transform(data: { staff: Staff[] }): Staff[] {
    return data.staff
  },
})

const notBannedStaffList = computed(
  (): Staff[] =>
    staffList.value?.filter((staff: Staff) => staff.banned_at !== null) ?? [],
)
</script>
