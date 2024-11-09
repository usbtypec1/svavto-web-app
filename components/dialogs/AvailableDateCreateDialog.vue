<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Добавить месяц"
    class="mx-3"
  >
    <p class="mb-3">Выберите месяц который хотите открыть для записи на смену</p>
    <DatePicker
      view="month"
      v-model="dateToAdd"
      dateFormat="MM - yy год"
      class="flex-1"
      inline
      :min-date="new Date()"
    />
    <Message
      v-if="!dateToAdd"
      severity="error"
      variant="simple"
      class="mt-1"
    >
      Выберите месяц
    </Message>
    <Message
      v-if="isMonthDisabled"
      severity="error"
      variant="simple"
      class="mt-1"
    >
      Этот месяц уже доступен для выбора в графике
    </Message>

    <template #footer>
      <div class="flex w-full gap-x-3">
        <Button
          icon="pi pi-times"
          label="Отмена"
          severity="secondary"
          class="flex-1"
          @click="isVisible = false"
        />
        <Button
          icon="pi pi-check"
          label="Сохранить"
          class="flex-1"
          :disabled="!monthAndYear || isMonthDisabled"
          @click="emit('create', monthAndYear)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type { MonthAndYear } from '~/types/schedules'

const props = defineProps<{
  disabledMonthsAndYears: MonthAndYear[],
}>()

const emit = defineEmits(['create'])

const isVisible = defineModel<boolean>('visible', { required: true })

const dateToAdd = ref<Date>()


const monthAndYear = computed((): MonthAndYear | undefined => {
  if (!dateToAdd.value) return
  return {
    month: dateToAdd.value.getMonth() + 1,
    year: dateToAdd.value.getFullYear(),
  }
})

const isMonthDisabled = computed((): boolean => {
  if (!monthAndYear.value) return false
  return props.disabledMonthsAndYears.some((disabledMonthAndYear) => {
    return disabledMonthAndYear.month === monthAndYear.value!.month
      && disabledMonthAndYear.year === monthAndYear.value!.year
  })
})
</script>
