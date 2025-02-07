import type { StaffIdAndName } from "~/types/staff"
import type { ShiftsConfirmation } from "~/types/shifts"

interface ShiftConfirmationLabelsArgs {
  isTargetedStaffMode: Ref<boolean>
  date: Ref<Date>
  selectedStaffList: Ref<StaffIdAndName[]>
}

export const useShiftConfirmationLabels = ({
  isTargetedStaffMode,
  date,
  selectedStaffList,
}: ShiftConfirmationLabelsArgs) => {
  const formattedDate = useDateFormat(date, "DD.MM.YYYY")

  const calendarLabel = computed((): string => {
    return isTargetedStaffMode.value
      ? "Дата на которую поставить смены"
      : "Дата на которую поставили смены"
  })

  const confirmationText = computed((): string => {
    if (isTargetedStaffMode.value) {
      return `Отправить запрос выбранным (${selectedStaffList.value.length}) сотрудникам?`
    }
    return `Отправить запрос на дату ${formattedDate.value} выбранным (${selectedStaffList.value.length}) сотрудникам?`
  })

  return {
    calendarLabel,
    confirmationText,
  }
}


interface ShiftConfirmationDataArgs {
  date: Ref<Date>
  selectedStaffList: Ref<StaffIdAndName[]>
}

export const useShiftConfirmationDataToSend = ({
  date,
  selectedStaffList,
}: ShiftConfirmationDataArgs) => {
  const formattedDate = useDateFormat(date, "YYYY-MM-DD")

  const shiftsForDateToSend = computed((): ShiftsConfirmation => {
    return {
      date: formattedDate.value,
      staff_list: selectedStaffList.value,
    }
  })

  const serializedData = computed((): string =>
    JSON.stringify(shiftsForDateToSend.value),
  )

  return {
    shiftsForDateToSend,
    serializedData,
  }
}
