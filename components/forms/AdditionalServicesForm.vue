<template>
  <AdditionalServicesFormList
    v-model="additionalServices"
  />
</template>

<script setup lang="ts">
import AdditionalServicesFormList from '~/components/forms/AdditionalServicesFormList.vue'
import type { AdditionalServiceItem, AdditionalServiceParent } from '~/types/additional-services'

const additionalServices = ref<(AdditionalServiceItem | AdditionalServiceParent)[]>([
  {
    name: 'trunk_vacuum',
    label: 'Пылесос багажника',
    isIncluded: false,
    isCountEditable: false,
    count: 1,
  },
  {
    name: 'window_washing_inside',
    label: 'Мойка стекол изнутри',
    isIncluded: false,
    isCountEditable: false,
    count: 1,
  },
  {
    name: 'interior_dry_cleaning',
    label: 'Химчистка салона',
    isIncluded: false,
    children: [
      {
        name: 'cup_holder',
        label: 'Подстаканник',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'armrest',
        label: 'Подлокотник',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'front_top_seat',
        label: 'Переднее сиденье верх',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'front_bottom_seat',
        label: 'Переднее сиденье низ',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'back_top_seat',
        label: 'Заднее сиденье верх',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'back_bottom_seat',
        label: 'Заднее сиденье низ',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'floor',
        label: 'Пол',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'back_floor_tunnel',
        label: 'Задний напольный тоннель',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'inside_door',
        label: 'Дверь',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'trunk_rack',
        label: 'Настил багажника',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'ceil',
        label: 'Потолок',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'dashboard',
        label: 'Торпедо',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'glove_box',
        label: 'Бардачок',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'item_cleaning_from_wool',
        label: 'Чистка 1го элемента от шерсти',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
    ],
  },
  {
    name: 'body_dry_cleaning',
    label: 'Химчистка кузова',
    isIncluded: false,
    children: [
      {
        name: 'front_bumper',
        label: 'Бампер передний',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'radiator_grille',
        label: 'Решетка радиатора',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'headlight',
        label: 'Фары',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'hood',
        label: 'Капот',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'threshold',
        label: 'Порог',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'rack',
        label: 'Стойка',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'outside_door',
        label: 'Дверь',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'door_window',
        label: 'Стекло',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'windshield',
        label: 'Лобовое стекло',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'rear_window',
        label: 'Заднее стекло',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'roof',
        label: 'Крыша',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
      {
        name: 'back_bumper',
        label: 'Задний бампер',
        isIncluded: false,
        isCountEditable: false,
        count: 1,
      },
      {
        name: 'side_mirror',
        label: 'Боковое зеркало',
        isIncluded: false,
        isCountEditable: true,
        count: 1,
      },
    ],
  },
  {
    name: 'disk_dry_cleaning',
    label: 'Химчистка дисков',
    isIncluded: false,
    isCountEditable: true,
    count: 1,
  },
])

interface IncludedAdditionalService {
  name: string
  count: number
}

const traverse = (services: (AdditionalServiceItem | AdditionalServiceParent)[]): IncludedAdditionalService[] => {
  const includedServices: IncludedAdditionalService[] = []

  services.forEach(service => {
    // Check if service is a parent by checking if it has children property
    if ('children' in service) {
      // If parent is included, traverse its children
      if (service.isIncluded) {
        service.children.forEach(child => {
          if (child.isIncluded) {
            includedServices.push({
              name: child.name,
              count: child.count
            })
          }
        })
      }
    } else {
      // It's an item
      if (service.isIncluded) {
        includedServices.push({
          name: service.name,
          count: service.count
        })
      }
    }
  })

  return includedServices
}

const additionalServicesModel = defineModel<IncludedAdditionalService[]>({ required: true })

watch(additionalServices, () => {
  additionalServicesModel.value = traverse(additionalServices)
})

</script>
