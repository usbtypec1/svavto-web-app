import {
  WindshieldWasherType,
  type WindshieldWasherTypeOption,
} from "~/types/cars"

export const windshieldWasherRefilledBottlePercentageOptions: number[] = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120,
]

export const windshieldWasherTypeOptions: WindshieldWasherTypeOption[] = [
  {
    label: "Без долива",
    value: WindshieldWasherType.None,
  },
  {
    label: "Вода",
    value: WindshieldWasherType.Water,
  },
  {
    label: "Незамерзающая жидкость",
    value: WindshieldWasherType.Antifreeze,
  },
]
