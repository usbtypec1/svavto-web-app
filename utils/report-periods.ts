import type { ReportPeriod } from "~/types/report-periods"

export const getReportPeriods = ({
  fromDate,
  toDate,
}: ReportPeriod): ReportPeriod[] => {
  // Parse the input dates
  if (fromDate > toDate) {
    throw new Error("'fromDate' must be earlier than 'toDate'")
  }

  const periods: ReportPeriod[] = []

  let current = new Date(fromDate)

  while (current <= toDate) {
    const year = current.getFullYear()
    const month = current.getMonth()

    // Define the first half of the month (1-15)
    const firstHalfEnd = new Date(year, month, 15)
    if (current <= firstHalfEnd) {
      periods.push({
        fromDate: new Date(current),
        toDate: firstHalfEnd < toDate ? firstHalfEnd : new Date(toDate),
      })
    }

    // Define the second half of the month (16 to month end)
    const secondHalfStart = new Date(year, month, 16)
    const monthEnd = new Date(year, month + 1, 0) // Last day of the current month
    if (current <= monthEnd && secondHalfStart <= toDate) {
      periods.push({
        fromDate:
          secondHalfStart > current ? secondHalfStart : new Date(current),
        toDate: monthEnd < toDate ? monthEnd : new Date(toDate),
      })
    }

    // Move to the next month
    current = new Date(year, month + 1, 1)
  }

  return periods
}

export const isDateWithinPeriod = (
  date: Date,
  period: ReportPeriod,
): boolean => {
  // Check if the date is within the period
  return date >= period.fromDate && date <= period.toDate
}
