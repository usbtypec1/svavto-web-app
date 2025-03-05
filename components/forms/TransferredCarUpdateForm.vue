<template>
  <Form
    :resolver
    @submit="onSubmit"
    class="flex flex-col gap-y-4"
    :initial-values="initialValues"
    :validate-on-value-update="false"
    :validate-on-blur="true"
  >
    <FormField v-slot="$number" name="number">
      <Fieldset>
        <template #legend>
          <div
            @click="onShowCarNumberHelpText"
            class="flex items-center gap-x-2"
          >
            <i class="pi pi-info-circle"></i>
            <span>Гос.номер</span>
          </div>
        </template>
        <InputText id="number" fluid placeholder="а111аа799" type="text" />
        <Message
          v-if="$number?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $number.error?.message }}
        </Message>
      </Fieldset>
    </FormField>

    <FormField v-slot="$classType" name="classType">
      <Fieldset legend="Класс автомобиля">
        <SelectButton
          :options="classTypeOptions"
          option-label="label"
          option-value="value"
        />
        <Message
          v-if="$classType?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $classType.error?.message }}
        </Message>
      </Fieldset>
    </FormField>

    <FormField v-slot="$washType" name="washType">
      <Fieldset legend="Вид мойки">
        <SelectButton
          :options="washTypeOptions"
          option-label="label"
          option-value="value"
        />
        <Message
          v-if="$washType?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $washType.error?.message }}
        </Message>
      </Fieldset>
    </FormField>

    <Fieldset legend="Долив воды/незамерзающей жидкости">
      <FormField v-slot="$windshieldWasher" name="windshieldWasher">
        <RadioButtonGroup class="flex flex-col gap-y-2">
          <div
            v-for="windshieldWasherOption in windshieldWasherOptions"
            :key="windshieldWasherOption"
            class="flex items-center gap-x-2"
          >
            <RadioButton
              size="large"
              :value="windshieldWasherOption"
              :input-id="windshieldWasherOption"
            />
            <label :for="windshieldWasherOption" class="text-md">{{
              windshieldWasherOption
            }}</label>
          </div>
          <Message
            v-if="$windshieldWasher?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $windshieldWasher.error.message }}
          </Message>

          <FormField
            v-slot="$windshieldWasherRefilledBottlePercentage"
            name="windshieldWasherRefilledBottlePercentage"
          >
            <div
              v-show="$windshieldWasher.value === windshieldWasherOptions[2]"
            >
              <label for="windshield_washer_refilled_bottle_percentage">
                Сколько % от бутылки было залито?
              </label>
              <Select
                :options="windshieldWasherRefilledBottlePercentageOptions"
                input-id="windshield_washer_refilled_bottle_percentage"
                fluid
                class="mt-1"
                name="windshieldWasherRefilledBottlePercentage"
              />
              <Message
                v-if="$windshieldWasherRefilledBottlePercentage?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $windshieldWasherRefilledBottlePercentage.error.message }}
              </Message>
            </div>
          </FormField>
        </RadioButtonGroup>
      </FormField>
    </Fieldset>

    <Fieldset legend="Мойка">
      <Select
        :options="carWashes"
        option-value="id"
        option-label="name"
        v-model="carWashId"
        fluid
        filter
        :filter-fields="['name']"
        placeholder="Выберите мойку"
        filter-icon="pi pi-search"
        filter-placeholder="Поиск по названию мойки"
        empty-filter-message="Мойка не найдена"
        empty-selection-message="Мойка не выбрана"
        empty-message="Нет моек"
      />
      <Message
        variant="simple"
        severity="warn"
        size="small"
        class="mt-1"
        icon="pi pi-exclamation-triangle"
      >
        При изменении мойки недоступные в этой мойке доп.услуги будут сброшены
      </Message>
    </Fieldset>

    <CarToWashAdditionalServicesForm
      v-model:service-id-to-count="serviceIdToCount"
      :specific-car-wash-services="carWashServices"
    />

    <Button
      label="Подтвердить"
      icon="pi pi-check"
      severity="primary"
      type="submit"
    />

    <BackButton @click="navigateTo('shifts-finish')"/>
  </Form>
</template>

<script setup lang="ts">
import type {
  TransferredCarDetail,
  UpdatedAdditionalService,
  TransferredCarUpdateEvent,
} from "~/types/cars"
import { Form, FormField, type FormSubmitEvent } from "@primevue/forms"
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { z } from "zod"
import { classTypeOptions, washTypeOptions } from "~/utils/car-wash-services"
import { useWebAppPopup, BackButton } from "vue-tg"
import {
  windshieldWasherRefilledBottlePercentageOptions,
  windshieldWasherOptions,
} from "~/utils/car-transfers"
import CarToWashAdditionalServicesForm from "~/components/cars-to-wash/forms/CarToWashAdditionalServicesForm.vue"
import type { CarWashService } from "~/types/car-wash-services"
import type { CarWashIdAndName } from "~/types/car-washes"

const props = defineProps<{
  transferredCar: TransferredCarDetail
  carWashes: CarWashIdAndName[]
  carWashServices: CarWashService[]
}>()

const carWashId = defineModel<number>("carWashId")

const emit = defineEmits<{
  submit: [values: TransferredCarUpdateEvent]
}>()

const { showAlert } = useWebAppPopup()

const serviceIdToCount = ref<Record<string, number>>({})

watchEffect(() => {
  const result: Record<string, number> = {}
  const carWashServiceIds = props.carWashServices.map(({ id }) => id)
  for (const { id, count } of props.transferredCar.additional_services) {
    if (carWashServiceIds.includes(id)) {
      result[id] = count
    }
  }
  serviceIdToCount.value = result
})

const updatedAdditionalServices = computed((): UpdatedAdditionalService[] => {
  return Object.entries(serviceIdToCount.value).map(([id, count]) => ({
    id,
    count,
  }))
})

const initialValues = computed(() => ({
  number: props.transferredCar?.number,
  classType: props.transferredCar?.class_type,
  washType: props.transferredCar?.wash_type,
  windshieldWasher:
    props.transferredCar.windshield_washer_refilled_bottle_percentage === 0
      ? windshieldWasherOptions[0]
      : windshieldWasherOptions[2],
  windshieldWasherRefilledBottlePercentage:
    props.transferredCar.windshield_washer_refilled_bottle_percentage,
}))

const carNumberRegExp = new RegExp(/^[А-Яа-я]\d{3}[А-Яа-я]{2}\d{3}$/)

const resolver = ref(
  zodResolver(
    z.object({
      number: z
        .string({ message: "Введите гос.номер" })
        .length(9, { message: "Гос.номер должен быть длиной 9 символов" })
        .regex(carNumberRegExp, {
          message:
            "Гос.номер должен быть в формате а111бв799 (буквы на кириллице и цифры)",
        }),
      classType: z.enum(
        classTypeOptions.map(({ value }) => value),
        {
          message: "Выберите одно из опций",
        },
      ),
      washType: z.enum(
        washTypeOptions.map(({ value }) => value),
        {
          message: "Выберите одно из опций",
        },
      ),
      windshieldWasher: z.enum(windshieldWasherOptions, {
        message: "Выберите одно из опций",
      }),
      windshieldWasherRefilledBottlePercentage: z.number({
        message: "Выберите % от бутылки, который был залит",
      }),
    }),
  ),
)

const onShowCarNumberHelpText = (): void => {
  showAlert(
    "Если в сервисном приложении нажать на номер, он скопируется и не придется печатать его вручную.",
  )
}

const onSubmit = ({ valid, values }: FormSubmitEvent) => {
  if (!valid) {
    showAlert('Ошибка при сохранении формы. Не все поля заполнены корректно.')
    console.error(`Invalid car update form: values=${JSON.stringify(values)}`)
  } else {
    values.additionalServices = updatedAdditionalServices.value
    values.carWashId = carWashId.value
    if (values["windshieldWasher"] !== windshieldWasherOptions[2]) {
      values.windshield_washer_refilled_bottle_percentage = 0
    }
    emit("submit", values as TransferredCarUpdateEvent)
  }
}
</script>
