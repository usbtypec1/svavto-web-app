<template>
  <div>
    <div class="flex flex-col gap-y-4" v-if="staffStore.notBannedStaff.length">
      <p class="text-lg font-semibold px-2">Выберите сотрудника, чей график хотите посмотреть</p>
      <NuxtLink
        v-for="staffItem in staffStore.notBannedStaff"
        :key="staffItem.id"
        :to="{ name: 'shifts-schedules-staffId', params: { staffId: staffItem.id }}"
      >
        <Card>
          <template #content>
            Сотрудник: {{ staffItem.full_name }}
          </template>
        </Card>
      </NuxtLink>
    </div>
    <Message
      v-else
      severity="warn"
    >
      Нет сотрудников
    </Message>
    <MainButton @click="close" text="Закрыть"/>
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp } from 'vue-tg'

const { close } = useWebApp()

const staffStore = useStaffStore()
await staffStore.fetchAll()
</script>
