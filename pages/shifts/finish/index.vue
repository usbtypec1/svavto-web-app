<template>
  <div>
    <template v-if="status === 'success'">
      <PageHeader :text="pageHeaderText!" />
      <PageSubheader :text="pageSubheaderText!" />

      <div class="flex flex-col gap-y-5">
        <Card
          v-for="(
            transferredCar, index
          ) in tranferredCarsResponseData!.transferred_cars"
          :key="transferredCar.id"
          :to="{
            name: 'shifts-finish-cars-id',
            params: { id: transferredCar.id },
          }"
        >
          <template #title
            >{{ index + 1 }}. Гос.номер {{ transferredCar.number }}
          </template>
          <template #content>
            <div class="flex flex-col gap-y-2">
              <div
                class="flex justify-between items-center border-b border-gray-200 dark:border-gray-500 pb-2"
              >
                <p>Мойка:</p>
                <p>{{ transferredCar.car_wash_name }}</p>
              </div>
              <div
                class="flex justify-between items-center border-b border-gray-200 dark:border-gray-500 pb-2"
              >
                <p>Класс:</p>
                <p>{{ humanizeClassType(transferredCar.class_type) }}</p>
              </div>
              <div
                class="flex justify-between items-center border-b border-gray-200 dark:border-gray-500 pb-2"
              >
                <p>Вид мойки:</p>
                <p>{{ humanizeWashType(transferredCar.wash_type) }}</p>
              </div>
              <div
                class="flex justify-between items-center border-b border-gray-200 dark:border-gray-500 pb-2"
              >
                <p>Залито незамерзайки:</p>
                <p
                  v-if="
                    transferredCar.windshield_washer_refilled_bottle_percentage ===
                    0
                  "
                >
                  Нет
                </p>
                <p v-else>
                  {{
                    transferredCar.windshield_washer_refilled_bottle_percentage
                  }}%
                </p>
              </div>
              <div
                v-for="service in transferredCar.additional_services"
                :key="service.id"
                class="flex justify-between items-center border-b border-gray-200 dark:border-gray-500 pb-2"
              >
                <p>{{ service.name }}</p>
                <p>{{ service.count }}</p>
              </div>
              <div class="flex justify-between items-center last:border-none">
                <p>Дата добавления:</p>
                <p>
                  {{
                    format(
                      parseISO(transferredCar.created_at),
                      "dd.MM.yyyy HH:mm",
                    )
                  }}
                </p>
              </div>
            </div>
          </template>
          <template #footer>
            <NuxtLink
              :to="{
                name: 'shifts-finish-cars-id',
                params: { id: transferredCar.id },
              }"
            >
              <Button label="Отредактировать" fluid text icon="pi pi-pencil" />
            </NuxtLink>
          </template>
        </Card>
      </div>

      <div class="my-10">
        <Fieldset legend="Подтверждение">
          <div class="flex items-center gap-x-2">
            <Checkbox
              v-model="isReadyToConfirm"
              binary
              input-id="is-user-confirmed"
            />
            <label for="is-user-confirmed">
              Я, подтверждаю что проверил всю введенную информацию
            </label>
          </div>
        </Fieldset>
      </div>
    </template>
    <MainButton
      :visible="isReadyToConfirm"
      text="Подтвердить"
      @click="onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { MainButton, useWebApp } from "vue-tg"
import { format, parseISO } from "date-fns"
import type { TransferredCarsListResponseData } from "~/types/cars"

const runtimeConfig = useRuntimeConfig()

const { sendData } = useWebApp()

const isReadyToConfirm = ref<boolean>(false)

const onConfirm = () => {
  sendData(JSON.stringify({ isConfirmed: true }))
}

definePageMeta({
  middleware: "shift-required",
})

const shiftId = useState<number>("shiftId")

const { data: tranferredCarsResponseData, status } =
  useFetch<TransferredCarsListResponseData>("/shifts/cars/", {
    baseURL: runtimeConfig.public.apiBaseUrl,
    query: { shift_id: shiftId },
  })

const pageSubheaderText = computed((): string | undefined => {
  if (status.value === "success") {
    return `Смена ${format(
      tranferredCarsResponseData.value!.shift_date,
      "dd.MM.yyyy",
    )}`
  }
})
const pageHeaderText = computed((): string | undefined => {
  if (status.value === "success")
    return tranferredCarsResponseData.value!.staff_full_name
})
</script>
