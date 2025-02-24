<template>
  <div>
    <ProgressSpinner v-if="status === 'pending'" />
    <template v-else-if="status === 'success'">
      <PageHeader text="Выберите сотрудников" />
      <Listbox
        v-model="selectedStaffIds"
        multiple
        checkmark
        :options="data!"
        option-label="full_name"
        option-value="id"
        empty-filter-message="Сотрудники не найдены"
        empty-message="Сотрудники не найдены"
        filter
        :filter-fields="[ 'full_name', 'id' ]"
        filter-message="{0} результатов"
        filter-icon="pi pi-search"
        list-style="max-height:70dvh"
        filter-placeholder="Поиск по ФИО, ID"
      />
    </template>
    <MainButton :visible="anySelectedStaff" @click="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp } from "vue-tg"

const { sendData } = useWebApp()

const selectedStaffIds = ref<number[]>([])
const anySelectedStaff = computed(
  (): boolean => selectedStaffIds.value.length > 0,
)

const onSubmit = () => {
  sendData?.(JSON.stringify(selectedStaffIds.value))
}

const { data, status } = useStaffList()
</script>
