<template>
  <Card>
    <template #title>
      Смена {{ dateToDDMMYYYY(new Date(shiftStatistics.shift_date)) }}
    </template>
    <template #content>
      <section class="flex flex-col">
        <div class="flex justify-between">
          <span>Штрафы:</span>
          <span>{{ shiftStatistics.penalty_amount }}</span>
        </div>
        <div class="flex justify-between">
          <span>Доплаты:</span>
          <span>{{ shiftStatistics.surcharge_amount }}</span>
        </div>
        <div class="flex justify-between">
          <span>Комфорт:</span>
          <span>{{ shiftStatistics.planned_comfort_cars_washed_count }}</span>
        </div>
        <div class="flex justify-between">
          <span>Бизнес:</span>
          <span>{{ shiftStatistics.planned_business_cars_washed_count }}</span>
        </div>
        <div class="flex justify-between">
          <span>Фургон:</span>
          <span>{{ shiftStatistics.planned_vans_washed_count }}</span>
        </div>
        <div class="flex justify-between">
          <span>Срочные:</span>
          <span>{{ shiftStatistics.urgent_cars_washed_count }}</span>
        </div>
        <div class="flex justify-between">
          <span>Доп.смена:</span>
          <span>{{ shiftStatistics.is_extra_shift ? "да" : "нет" }}</span>
        </div>
        <div class="flex justify-between">
          <span>Химчистка:</span>
          <span>{{ shiftStatistics.dry_cleaning_items_count }}</span>
        </div>
        <div class="flex justify-between">
          <span>Заработано:</span>
          <span>{{ shiftStatistics.washed_cars_total_cost }}</span>
        </div>
      </section>
    </template>
  </Card>
</template>

<script setup lang="ts">
defineProps<{
  shiftStatistics: any
}>()

const dateToYYYYMMDD = (date?: Date): string | undefined => {
  if (date === undefined) return
  return date.toISOString().split("T")[0]
}

const dateToDDMMYYYY = (date?: Date): string | undefined => {
  if (date === undefined) return
  const [year, month, day] = dateToYYYYMMDD(date)!.split("-")
  return `${day}.${month}.${year}`
}
</script>
