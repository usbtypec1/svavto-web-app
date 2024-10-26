<template>
  <div>
    <BackButton @click="onBackButtonClicked"/>
    <template v-if="staff !== null">
      <Fieldset legend="Месяц в графике у сотрудника">
        <form class="flex flex-col gap-y-3" @submit.prevent>
          <DatePicker
            v-model="staffScheduleMonthAndYear"
            view="month"
            dateFormat="MM - yy год"
          />
          <Button label="Сохранить" outlined icon="pi pi-save"/>
        </form>
      </Fieldset>
      <Fieldset legend="График сотрудника">
        <DatePicker
          v-model="shiftSchedules"
          selection-mode="multiple"
          :manual-input="false"
          inline
          class="w-full"
        />
      </Fieldset>
    </template>
    <Message
      v-else
      severity="warn"
      icon="pi pi-exclamation-triangle"
    >
      Сотрудник не найден
    </Message>
  </div>
</template>

<script setup lang="ts">
import { BackButton, useWebAppPopup, useWebAppHapticFeedback } from 'vue-tg'

const { showAlert } = useWebAppPopup()
const { notificationOccurred } = useWebAppHapticFeedback()

const shiftSchedules = ref<Date[]>()
const staffScheduleMonthAndYear = ref()

const onSaveStaffScheduleMonthAndYear = async () => {
  showAlert?.('Месяц в графике сотрудника сохранен')
  notificationOccurred?.('success')
}

const onBackButtonClicked = async () => {
  await navigateTo({ name: 'shifts-schedules' })
}

const route = useRoute()

const staffId = Number(route.params.staffId as string)

const staffStore = useStaffStore()
let staff = staffStore.findById(staffId)
if (staff === null) {
  staff = await staffStore.fetchById(staffId)
}

</script>
