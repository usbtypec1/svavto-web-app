<template>
  <div>
    <PageHeader text="Сотрудники не получающие доплату за выходные" />
    <Listbox
      :options="staffList!"
      v-model="selectedStaffIds"
      option-label="full_name"
      option-value="id"
      multiple
      checkmark
      filter
      filter-placeholder="Поиск по ФИО, ID сотрудника"
      empty-filter-message="Нет результатов"
      scroll-height="32rem"
      highlight-on-select
    />

    <Button @click="updateBonusExcludedStaff" label="Сохранить" fluid />
  </div>
</template>

<script setup lang="ts">
import { useWebAppPopup } from "vue-tg"

const { showAlert, showConfirm } = useWebAppPopup()

const { data: staffIds } = await useBonusExcludedStaff()
const { data: staffList } = await useStaffList({ orderBy: "full_name" })

const selectedStaffIds = ref<number[]>([])

watchEffect(() => {
  selectedStaffIds.value = staffList
    .value!.filter((staffItem) => staffIds.value!.includes(staffItem.id))
    .map((staffItem) => staffItem.id)
})

const runtimeConfig = useRuntimeConfig()
const updateBonusExcludedStaff = async () => {
  try {
    await $fetch("/bonuses/excluded-staff/", {
      baseURL: runtimeConfig.public.apiBaseUrl,
      method: "PUT",
      body: { staff_ids: selectedStaffIds.value },
    })
  } catch (error) {}
}

const onUpdateBonusExcludedStaff = async () => {
  
}
</script>
