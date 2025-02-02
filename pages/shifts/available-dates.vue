<template>
  <div>
    <p class="text-lg font-semibold mb-3">Месяцы доступные в графике</p>
    {{ error }}
    <div
      v-if="data.available_dates.length"
      class="flex flex-col gap-y-2"
    >
      <div
        v-for="{ id, month, year } in data.available_dates"
        :key="id"
      >
        <div
          class="flex justify-between items-center"
        >
          <p>
            {{ formatMonthAndYearToName({ month, year }) }}
          </p>
          <Button
            @click="onDeleteAvailableDate(id)"
            severity="danger"
            icon="pi pi-trash"
            text
          />
        </div>
        <Divider/>
      </div>
    </div>
    <div v-else>
      <Message
        severity="warn"
        icon="pi pi-info-circle"
      >
        Нет доступных месяцев
      </Message>
    </div>
    <DevOnly>
      <Button label="Добавить месяц" @click="isDialogVisible = true"/>
    </DevOnly>
    <MainButton
      @click="isDialogVisible = true"
      text="Добавить месяц"
    >
    </MainButton>
    <AvailableDateCreateDialog
      v-model:visible="isDialogVisible"
      @create="onCreateAvailableDate"
      :disabled-months-and-years="data.available_dates"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton } from 'vue-tg'
import AvailableDateCreateDialog from '~/components/dialogs/AvailableDateCreateDialog.vue'


interface MonthAndYear {
  month: number
  year: number
}

interface AvailableDate extends MonthAndYear {
  id: number
}

const runtimeConfig = useRuntimeConfig()
const { data, error, refresh } = await useFetch<{ available_dates: AvailableDate[] }>('/shifts/available-dates/', {
  baseURL: runtimeConfig.public.apiBaseUrl,
})

const formatMonthAndYearToName = ({ month, year }: MonthAndYear): string => {
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ]
  return `${months[month - 1]} ${year} год`
}

const isDialogVisible = ref<boolean>(false)


const onDeleteAvailableDate = async (id: number): Promise<void> => {
  await $fetch(`/shifts/available-dates/${id}/`, {
    method: 'DELETE',
    baseURL: runtimeConfig.public.apiBaseUrl,
    async onResponse() {
      await refresh()
    },
  })
}

const onCreateAvailableDate = async ({ month, year }: MonthAndYear): Promise<void> => {
  await $fetch('/shifts/available-dates/', {
    method: 'POST',
    baseURL: runtimeConfig.public.apiBaseUrl,
    body: { month, year },
    async onResponse() {
      isDialogVisible.value = false
      await refresh()
    },
  })
}
</script>
